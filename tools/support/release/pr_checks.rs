//! Require every configured check, including jobs not yet present in a PR rollup.
use super::{
    pr_contract::{self, Candidate},
    pr_github as github,
};
use serde_json::Value;
use std::path::Path;

pub fn ready(candidate: &Candidate, selected: &[Value], root: &Path) -> Result<bool, String> {
    let rules = github::api(&candidate.repository, "rules/branches/main", root)?;
    let mut checks = Vec::new();
    for page in 1..=100 {
        let response = github::api(
            &candidate.repository,
            &format!(
                "commits/{}/check-runs?filter=latest&per_page=100&page={page}",
                candidate.head
            ),
            root,
        )?;
        let rows = response
            .get("check_runs")
            .and_then(Value::as_array)
            .ok_or("Missing commit check runs")?;
        checks.extend(rows.iter().cloned());
        if rows.len() < 100 {
            return required_checks(&rules, &checks, selected, &candidate.head);
        }
    }
    Err("Commit checks exceeded the pagination limit".into())
}

pub fn required_checks(
    rules: &Value,
    checks: &[Value],
    selected: &[Value],
    head: &str,
) -> Result<bool, String> {
    pr_contract::sha(head)?;
    let rules = rules.as_array().ok_or("Missing main branch rules")?;
    let required: Vec<_> = rules
        .iter()
        .filter(|rule| rule.get("type").and_then(Value::as_str) == Some("required_status_checks"))
        .map(|rule| {
            rule.pointer("/parameters/required_status_checks")
                .and_then(Value::as_array)
                .ok_or("Invalid required status check rule")
        })
        .collect::<Result<Vec<_>, _>>()?
        .into_iter()
        .flatten()
        .collect();
    if required.is_empty() {
        return Err(
            "No required status checks are configured in main's rulesets; refusing to promote."
                .into(),
        );
    }
    let mut complete = true;
    for required in required {
        let name = pr_contract::field(required, "/context")?;
        let app = required
            .get("integration_id")
            .and_then(Value::as_u64)
            .filter(|id| *id > 0);
        let matching: Vec<_> = selected
            .iter()
            .filter(|check| check.get("name").and_then(Value::as_str) == Some(name))
            .collect();
        let [rollup] = matching.as_slice() else {
            if matching.is_empty() {
                complete = false;
                continue;
            }
            return Err(format!("Ambiguous required PR check {name}."));
        };
        if rollup.get("bucket").and_then(Value::as_str) != Some("pass") {
            complete = false;
            continue;
        }
        let link = pr_contract::field(rollup, "/link")?;
        let matched: Vec<_> = checks
            .iter()
            .filter(|check| {
                check.get("name").and_then(Value::as_str) == Some(name)
                    && check.get("head_sha").and_then(Value::as_str) == Some(head)
                    && check.get("details_url").and_then(Value::as_str) == Some(link)
                    && app.is_none_or(|id| {
                        check.pointer("/app/id").and_then(Value::as_u64) == Some(id)
                    })
            })
            .collect();
        let exact = match matched.as_slice() {
            [] => {
                complete = false;
                continue;
            }
            [check] => *check,
            _ => return Err(format!("Ambiguous exact-head check run for {name}.")),
        };
        if exact.get("status").and_then(Value::as_str) != Some("completed") {
            complete = false;
        } else if exact.get("conclusion").and_then(Value::as_str) != Some("success") {
            return Err(format!(
                "Required check {name} did not succeed; no tag was created."
            ));
        }
    }
    Ok(complete)
}
