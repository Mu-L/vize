use super::ProjectSources;

#[test]
fn long_unicode_normalized_keys_share_storage_between_owners() {
    let path = "./src/components/application/共有状態/./UserPanel.tsx";
    let mut project = ProjectSources::new();
    let id = project
        .add(path, "export const render = () => <span>状態</span>")
        .unwrap();
    let module = project.module(id).unwrap();
    let (map_key, mapped_id) = project.by_key.get_key_value(module.key.as_str()).unwrap();
    assert_eq!(*mapped_id, id);
    assert_eq!(module.path(), path.strip_prefix("./").unwrap());
    assert_eq!(
        module.key.as_str(),
        "src/components/application/共有状態/UserPanel.tsx"
    );
    assert_eq!(module.key.as_ptr(), map_key.as_ptr());
    assert_eq!(module.stem(), "UserPanel");
    assert!(module.scripts().next().unwrap().source_type.is_jsx());
    assert!(
        project
            .add(
                "src/components/application/共有状態/UserPanel.tsx",
                "changed"
            )
            .is_none()
    );
    assert_eq!(project.len(), 1);
}

#[test]
fn resolution_mutates_candidates_without_changing_stored_keys() {
    let mut project = ProjectSources::new();
    let root = project
        .add("src/components/application/状態/Entry.ts", "")
        .unwrap();
    let sibling = project
        .add("src/components/application/状態/Child.vue", "<template />")
        .unwrap();
    let index = project
        .add("src/components/application/状態/widgets/index.ts", "")
        .unwrap();
    for _ in 0..3 {
        assert_eq!(project.resolve(root, "./Child"), Some(sibling));
        assert_eq!(project.resolve(root, "./widgets"), Some(index));
        assert!(project.resolve(root, "./missing").is_none());
        assert_eq!(
            project.module(root).unwrap().key.as_str(),
            "src/components/application/状態/Entry.ts"
        );
    }
}

#[test]
fn independent_projects_keep_module_identity_and_authored_byte_ranges() {
    let source = "<template>🙂{{ message }}</template>\n<script setup lang=\"ts\">const message = '状態'</script>";
    let mut first = ProjectSources::new();
    let id = first.add("src/状態/Entry.vue", source).unwrap();
    let mut second = ProjectSources::new();
    let second_id = second
        .add("other/Entry.ts", "export const unrelated = 1")
        .unwrap();
    assert_eq!(id, second_id);
    assert_eq!(first.module(id).unwrap().source(), source);
    assert_eq!(second.module(second_id).unwrap().path(), "other/Entry.ts");
    let module = first.module(id).unwrap();
    let script = module.scripts().next().unwrap();
    assert_eq!(
        script.offset as usize,
        source.find("const message").unwrap()
    );
    assert_eq!(script.text, "const message = '状態'");
    let template = module.template().unwrap();
    assert_eq!(template.text, "🙂{{ message }}");
    assert_eq!(template.offset as usize, source.find('🙂').unwrap());
}

#[test]
fn inline_boundary_keys_keep_exact_spelling_and_borrowed_lookup() {
    let mut project = ProjectSources::new();
    for stem in [
        "a",
        "12345678901",
        "123456789012",
        "123456789012345678901",
        "1234567890123456789012",
    ] {
        let path = vize_carton::cstr!("{stem}.ts");
        let id = project.add(path.as_str(), "").unwrap();
        let module = project.module(id).unwrap();
        assert_eq!(module.path(), path.as_str());
        assert_eq!(project.by_key.get(path.as_str()), Some(&id));
    }
    assert_eq!(project.len(), 5);
}
