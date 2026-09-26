//! Checked conversions for the dense, typed scope table.

use super::ScopeId;
use index_vec::Idx;

impl Idx for ScopeId {
    #[inline]
    fn from_usize(index: usize) -> Self {
        // Keep the public raw u32 representation, including ROOT = 0.
        // A table cannot silently wrap when its row count exceeds that domain.
        assert!(
            index <= u32::MAX as usize,
            "scope table exhausted the u32 ID domain"
        );
        Self::new(index as u32)
    }

    #[inline]
    fn index(self) -> usize {
        self.as_u32() as usize
    }
}

#[cfg(test)]
mod tests {
    use super::{Idx, ScopeId};
    use crate::{ScopeChain, ScopeKind};

    #[test]
    fn raw_ids_and_dense_rows_preserve_order_and_reject_absent_rows() {
        for raw in [0, 42, u32::MAX] {
            assert_eq!(ScopeId::new(raw).as_u32(), raw);
            assert_eq!(ScopeId::from_usize(raw as usize), ScopeId::new(raw));
        }
        let mut scopes = ScopeChain::new();
        let outer = scopes.enter_scope(ScopeKind::ScriptSetup);
        let inner = scopes.enter_scope(ScopeKind::Closure);
        assert_eq!(outer.as_u32(), 1);
        assert_eq!(inner.as_u32(), 2);
        assert_eq!(
            scopes
                .get_scope(inner)
                .expect("the inner row exists")
                .parent(),
            Some(outer)
        );
        assert!(scopes.get_scope(ScopeId::new(u32::MAX)).is_none());
        assert_eq!(
            scopes
                .iter()
                .map(|scope| scope.id.as_u32())
                .collect::<Vec<_>>(),
            vec![0, 1, 2]
        );
    }

    #[test]
    #[cfg(target_pointer_width = "64")]
    #[should_panic(expected = "scope table exhausted the u32 ID domain")]
    fn an_exhausted_table_does_not_truncate_a_row_index() {
        let _ = ScopeId::from_usize(u32::MAX as usize + 1);
    }
}
