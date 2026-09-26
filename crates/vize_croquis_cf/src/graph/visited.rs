//! Membership follows the actual ID density, never an untrusted maximum alone.

use super::{FileId, FxHashMap, ModuleNode};
use fixedbitset::FixedBitSet;
use vize_carton::FxHashSet;

pub(super) enum VisitSet {
    Dense(FixedBitSet),
    Sparse(FxHashSet<FileId>),
}

impl VisitSet {
    pub(super) fn pair(nodes: &FxHashMap<FileId, ModuleNode>) -> (Self, Self) {
        // Edges may refer to absent nodes. Include their IDs so both sets can
        // mark them without growing or changing the previous traversal order.
        let highest = nodes
            .iter()
            .flat_map(|(&id, node)| {
                core::iter::once(id).chain(node.imports.iter().map(|(id, _)| *id))
            })
            .map(FileId::as_u32)
            .max();
        let domain = highest
            .and_then(|highest| usize::try_from(highest).ok())
            .and_then(|highest| highest.checked_add(1))
            .unwrap_or(0);
        // At this density the bit payload uses at most half a byte per node,
        // versus at least four bytes per stored FileId in a hash set.
        // A sparse/high FileId never drives a proportional dense allocation.
        let dense = highest.is_none() || (domain > 0 && domain <= nodes.len().saturating_mul(4));
        let make = || {
            if dense {
                Self::Dense(FixedBitSet::with_capacity(domain))
            } else {
                Self::Sparse(FxHashSet::default())
            }
        };
        (make(), make())
    }

    pub(super) fn insert(&mut self, id: FileId) {
        match self {
            Self::Dense(bits) => bits.insert(id.as_u32() as usize),
            Self::Sparse(bits) => {
                bits.insert(id);
            }
        }
    }

    pub(super) fn contains(&self, id: &FileId) -> bool {
        match self {
            Self::Dense(bits) => bits.contains(id.as_u32() as usize),
            Self::Sparse(bits) => bits.contains(id),
        }
    }

    pub(super) fn remove(&mut self, id: &FileId) {
        match self {
            Self::Dense(bits) => bits.set(id.as_u32() as usize, false),
            Self::Sparse(bits) => {
                bits.remove(id);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{FileId, FxHashMap, ModuleNode, VisitSet};
    use crate::graph::DependencyEdge;

    fn pair(ids: &[u32], dangling: Option<u32>) -> (VisitSet, VisitSet) {
        let mut nodes = FxHashMap::default();
        for &id in ids {
            let id = FileId::new(id);
            nodes.insert(id, ModuleNode::new(id, "test.vue"));
        }
        if let Some(dangling) = dangling {
            nodes
                .values_mut()
                .next()
                .expect("a dangling edge has an owner")
                .imports
                .push((FileId::new(dangling), DependencyEdge::Import));
        }
        VisitSet::pair(&nodes)
    }

    #[test]
    fn dense_rows_use_fixed_bits_and_sparse_or_dangling_ids_keep_hash_sets() {
        assert!(matches!(pair(&[], None).0, VisitSet::Dense(_)));
        assert!(matches!(pair(&[0, 1, 2], None).0, VisitSet::Dense(_)));
        assert!(matches!(
            pair(&[0, 1, u32::MAX], None).0,
            VisitSet::Sparse(_)
        ));
        assert!(matches!(
            pair(&[0, 1], Some(u32::MAX)).0,
            VisitSet::Sparse(_)
        ));
    }

    #[test]
    fn both_domains_keep_sets_independent_and_support_removal() {
        for ids in [&[0, 1, 2][..], &[0, 65536, u32::MAX][..]] {
            let (mut visited, stack) = pair(ids, None);
            for &id in ids {
                let id = FileId::new(id);
                visited.insert(id);
                let present = (visited.contains(&id), stack.contains(&id));
                visited.remove(&id);
                let after_removal = visited.contains(&id);
                assert_eq!((present, after_removal), ((true, false), false));
            }
        }
    }
}
