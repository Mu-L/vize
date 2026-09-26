//! Preserve the graph DFS order while storing membership compactly.

use super::visited::VisitSet;
use super::{DependencyGraph, FileId, FxHashMap, ModuleNode};

impl DependencyGraph {
    /// Detect circular dependencies using DFS.
    pub fn detect_circular_dependencies(&mut self) {
        self.circular_deps.clear();

        let (mut visited, mut rec_stack) = VisitSet::pair(&self.nodes);
        let mut path = Vec::new();
        let mut cycles = Vec::new();

        for start_id in self.nodes.keys().copied() {
            if !visited.contains(&start_id) {
                Self::dfs_cycle_static(
                    &self.nodes,
                    start_id,
                    &mut visited,
                    &mut rec_stack,
                    &mut path,
                    &mut cycles,
                );
            }
        }

        self.circular_deps = cycles;
    }

    fn dfs_cycle_static(
        nodes: &FxHashMap<FileId, ModuleNode>,
        id: FileId,
        visited: &mut VisitSet,
        rec_stack: &mut VisitSet,
        path: &mut Vec<FileId>,
        cycles: &mut Vec<Vec<FileId>>,
    ) {
        visited.insert(id);
        rec_stack.insert(id);
        path.push(id);

        if let Some(node) = nodes.get(&id) {
            for (dep_id, _) in &node.imports {
                if !visited.contains(dep_id) {
                    Self::dfs_cycle_static(nodes, *dep_id, visited, rec_stack, path, cycles);
                } else if rec_stack.contains(dep_id) {
                    // Found a cycle - extract the cycle from path
                    if let Some(start) = path.iter().position(|p| p == dep_id) {
                        let cycle: Vec<_> = path.get(start..).unwrap_or_default().to_vec();
                        cycles.push(cycle);
                    }
                }
            }
        }

        path.pop();
        rec_stack.remove(&id);
    }
}

#[cfg(test)]
mod tests {
    use super::{DependencyGraph, FileId, FxHashMap, ModuleNode};
    use crate::graph::DependencyEdge;
    use vize_carton::FxHashSet;

    fn oracle(graph: &DependencyGraph) -> Vec<Vec<FileId>> {
        let mut visited = FxHashSet::default();
        let mut stack = FxHashSet::default();
        let mut path = Vec::new();
        let mut cycles = Vec::new();
        for start in graph.nodes.keys().copied() {
            if !visited.contains(&start) {
                oracle_dfs(
                    &graph.nodes,
                    start,
                    &mut visited,
                    &mut stack,
                    &mut path,
                    &mut cycles,
                );
            }
        }
        cycles
    }

    fn oracle_dfs(
        nodes: &FxHashMap<FileId, ModuleNode>,
        id: FileId,
        visited: &mut FxHashSet<FileId>,
        rec_stack: &mut FxHashSet<FileId>,
        path: &mut Vec<FileId>,
        cycles: &mut Vec<Vec<FileId>>,
    ) {
        visited.insert(id);
        rec_stack.insert(id);
        path.push(id);

        if let Some(node) = nodes.get(&id) {
            for (dep_id, _) in &node.imports {
                if !visited.contains(dep_id) {
                    oracle_dfs(nodes, *dep_id, visited, rec_stack, path, cycles);
                } else if rec_stack.contains(dep_id) {
                    // Found a cycle - extract the cycle from path
                    if let Some(start) = path.iter().position(|p| p == dep_id) {
                        let cycle: Vec<_> = path.get(start..).unwrap_or_default().to_vec();
                        cycles.push(cycle);
                    }
                }
            }
        }

        path.pop();
        rec_stack.remove(&id);
    }

    #[test]
    fn dense_and_sparse_membership_preserve_exact_cycle_discovery_order() {
        for ids in [
            [0, 1, 2, 3, 4, 5],
            [0, 65536, 9, 1 << 30, u32::MAX - 1, u32::MAX],
        ] {
            let mut graph = DependencyGraph::new();
            for index in [3, 1, 4, 0, 5, 2] {
                graph.add_node(ModuleNode::new(FileId::new(ids[index]), "test.vue"));
            }
            for (from, to, kind) in [
                (0, 1, DependencyEdge::Import),
                (1, 2, DependencyEdge::Import),
                (2, 0, DependencyEdge::Import),
                (2, 3, DependencyEdge::Import),
                (3, 4, DependencyEdge::Import),
                (4, 3, DependencyEdge::Import),
                (5, 5, DependencyEdge::Import),
                (0, 1, DependencyEdge::TypeImport),
            ] {
                graph.add_edge(FileId::new(ids[from]), FileId::new(ids[to]), kind);
            }
            // An absent edge target and a mutated payload ID must not drive
            // unchecked dense indexing or change discovery order.
            graph.add_edge(
                FileId::new(ids[0]),
                FileId::new(u32::MAX),
                DependencyEdge::DynamicImport,
            );
            graph
                .get_node_mut(FileId::new(ids[1]))
                .expect("existing node")
                .file_id = FileId::new(7);
            let expected = oracle(&graph);
            assert!(!expected.is_empty());
            graph.detect_circular_dependencies();
            assert_eq!(graph.circular_dependencies(), expected);
        }
    }
}
