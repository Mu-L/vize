use super::{build_pool, key_parts};
use vize_croquis::provide::ProvideKey;

#[test]
fn repeated_unicode_names_share_a_symbol_and_keep_namespaces_distinct() {
    let string = ProvideKey::String("共有状態の非常に長い識別子🙂".into());
    let symbol = ProvideKey::Symbol("共有状態の非常に長い識別子🙂".into());
    let keys = [&string, &symbol, &string];
    let pool = build_pool(keys.into_iter()).unwrap();
    assert_eq!(pool.len(), 1);
    assert_ne!(key_parts(&string).0, key_parts(&symbol).0);
    assert_eq!(
        pool.get(key_parts(&string).1),
        pool.get(key_parts(&symbol).1)
    );
    assert_eq!(
        pool.strings().collect::<Vec<_>>(),
        vec![key_parts(&string).1]
    );
    assert!(pool.current_memory_usage() <= key_parts(&string).1.len());
}

#[test]
fn symbols_preserve_lexical_order_independent_of_encounter_order() {
    let keys = [
        ProvideKey::String("zeta".into()),
        ProvideKey::String("alpha".into()),
        ProvideKey::Symbol("beta".into()),
    ];
    let pool = build_pool(keys.iter()).unwrap();
    let mut interned = keys
        .iter()
        .map(|key| (key_parts(key).0, pool.get(key_parts(key).1).unwrap()))
        .collect::<Vec<_>>();
    let mut authored = keys.iter().map(key_parts).collect::<Vec<_>>();
    interned.sort_unstable();
    authored.sort_unstable();
    assert_eq!(
        interned
            .iter()
            .map(|(namespace, symbol)| (*namespace, pool.resolve(symbol)))
            .collect::<Vec<_>>(),
        authored,
    );
}

#[test]
fn pool_lifetime_is_per_build_and_empty_keys_are_valid() {
    let first = ProvideKey::String("".into());
    let second = ProvideKey::String("symbol:another-project".into());
    let first_pool = build_pool(std::iter::once(&first)).unwrap();
    let second_pool = build_pool(std::iter::once(&second)).unwrap();
    assert!(first_pool.get("").is_some());
    assert!(second_pool.get("").is_none());
    assert!(first_pool.get(key_parts(&second).1).is_none());
    assert_eq!(first_pool.len(), 1);
    assert_eq!(second_pool.len(), 1);
}
