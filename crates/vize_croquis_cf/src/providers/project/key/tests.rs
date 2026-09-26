use super::ModuleKey;
use vize_carton::{CompactString, FxHashMap};

#[test]
fn compact_inline_capacity_is_preserved_before_sharing_long_keys() {
    let capacity = CompactString::default().capacity();
    for length in 0..=capacity {
        let mut key = ModuleKey::default();
        let text = "x".repeat(length);
        key.push_str(&text);
        assert_eq!(key.as_str(), text);
        let ModuleKey::Inline(inline) = &key else {
            panic!("a CompactString-inline key must stay inline");
        };
        assert!(!inline.is_heap_allocated());
        let cloned = key.clone();
        assert!(matches!(cloned, ModuleKey::Inline(_)));
    }
    let mut key = ModuleKey::default();
    key.push_str(&"x".repeat(capacity));
    key.push('🙂');
    assert!(matches!(key, ModuleKey::Shared(_)));
    let cloned = key.clone();
    assert_eq!(key.as_ptr(), cloned.as_ptr());
    assert_eq!(key.len(), capacity + '🙂'.len_utf8());
}

#[test]
fn borrowed_hash_lookup_survives_transition_and_cow_mutation() {
    let mut key = ModuleKey::default();
    key.push_str("src/components/application/共有状態/Module");
    let original = key.clone();
    let mut map = FxHashMap::default();
    map.insert(key.clone(), 7);
    assert_eq!(map.get(key.as_str()), Some(&7));
    key.push_str(".tsx");
    assert_eq!(
        original.as_str(),
        "src/components/application/共有状態/Module"
    );
    assert!(!map.contains_key(key.as_str()));
    assert_eq!(map.get(original.as_str()), Some(&7));
    assert_ne!(key.as_ptr(), original.as_ptr());
}
