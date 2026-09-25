/// Returns `true` when a `dist-tags` JSON object maps `tag` to `version`.
fn json_dist_tag_matches(value : Json, tag : String, version : String) -> Bool {
  guard value is Object(obj) else { return false }
  guard obj.get(tag) is Some(String(tag_version)) else { return false }
  tag_version == version
}

/// Escapes scoped package names for npm's registry URL path.
fn npm_registry_package_path(name : String) -> String {
  name.replace_all(old="@", new="%40").replace_all(old="/", new="%2F")
}

/// Reads npm directly so a package manager's cached 404 cannot hide a newly
/// published version. Each probe has a distinct URL and a short timeout.
async fn npm_registry_json(name : String, version : String?, probe : Int) -> Json? {
  let run_id = @env.get_env_var("GITHUB_RUN_ID").unwrap_or("local")
  let run_attempt = @env.get_env_var("GITHUB_RUN_ATTEMPT").unwrap_or("1")
  let package_path = npm_registry_package_path(name)
  let version_path = match version {
    Some(value) => "/" + value
    None => ""
  }
  let url = "https://registry.npmjs.org/" + package_path + version_path +
    "?vize-publish-check=" + run_id + "-" + run_attempt + "-" + probe.to_string()
  let (exit_code, output, _) = @process.collect_output("curl", [
    "--silent",
    "--show-error",
    "--connect-timeout",
    "3",
    "--max-time",
    "6",
    "--header",
    "Accept: application/json",
    "--header",
    "Cache-Control: no-cache",
    "--write-out",
    "VIZE_HTTP_STATUS:%{http_code}",
    url,
  ])
  if exit_code != 0 {
    return None
  }
  let parts : Array[String] = output
    .text()
    .split("VIZE_HTTP_STATUS:")
    .map(view => view.to_owned())
    .collect()
  if parts.length() != 2 || parts[1] != "200" {
    return None
  }
  try {
    Some(@json.parse(parts[0]))
  } catch {
    _ => None
  }
}

/// Checks whether the exact package version is visible from npm registry reads.
/// Visibility is more important than the publish command's exit code: if the
/// registry already serves `name@version`, rerunning the workflow should treat
/// that state as success rather than attempting to publish again.
async fn npm_version_is_visible(name : String, version : String, probe : Int) -> Bool {
  guard npm_registry_json(name, Some(version), probe) is Some(Object(obj)) else {
    return false
  }
  guard obj.get("name") is Some(String(returned_name)) else { return false }
  guard obj.get("version") is Some(String(returned_version)) else { return false }
  returned_name == name && returned_version == version
}

/// Checks whether the package's dist-tag has propagated to the expected version.
/// For consumers of prerelease channels, the dist-tag is often the real source
/// of truth. We therefore wait for both the version and the dist-tag instead of
/// declaring success immediately after `publish` returns.
async fn npm_tag_points_to_version(
  name : String,
  tag : String,
  version : String,
  probe : Int,
) -> Bool {
  guard npm_registry_json(name, None, probe) is Some(Object(obj)) else {
    return false
  }
  guard obj.get("name") is Some(String(returned_name)) else { return false }
  guard returned_name == name else { return false }
  guard obj.get("dist-tags") is Some(tags) else { return false }
  json_dist_tag_matches(tags, tag, version)
}

/// Polls the registry until both the version and dist-tag become visible.
/// Publishing to npm is eventually consistent. This helper turns that
/// propagation window into an explicit, bounded retry loop so workflow failures
/// point to a real timeout rather than a transient post-publish race.
async fn wait_for_registry_visibility(
  info : NpmPackageInfo,
  max_attempts : Int,
  delay_seconds : Int,
) -> Int {
  let mut attempt = 1
  while attempt <= max_attempts {
    let version_visible = npm_version_is_visible(info.name, info.version, attempt)
    let tag_visible = npm_tag_points_to_version(
      info.name, info.tag, info.version, attempt,
    )
    if version_visible && tag_visible {
      println(
        "\{info.name}@\{info.version} is visible in npm with dist-tag \{info.tag}.",
      )
      return 0
    }
    if attempt >= max_attempts {
      @stdio.stderr.write(
        "Timed out waiting for \{info.name}@\{info.version} to appear in npm with dist-tag \{info.tag}.\n",
      )
      return 1
    }
    println(
      "Waiting for \{info.name}@\{info.version} to appear in npm with dist-tag \{info.tag}... (\{attempt}/\{max_attempts})",
    )
    @async.sleep(delay_seconds * 1000)
    attempt = attempt + 1
  }
  1
}

