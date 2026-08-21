//! The `v-for` value split: Vue's text grammar, applied **before** any
//! parse — the P2-5b decision, consumed here rather than re-derived.
//!
//! # Why the split is textual (the `a in b in c` disagreement)
//!
//! JS `in` associates left; Vue's v-for grammar splits at the **first
//! viable** `in`/`of`. On `a in b in c` they genuinely disagree — Vue
//! reads alias `a`, source `b in c`; a retained AST of the whole value
//! would read `(a in b) in c`. That is the P1-6-recorded reason a v-for
//! value's retained AST must never be consumed naively, and why
//! [`OpaqueReason::ForValue`] exists: the whole value is **not a JS
//! expression**. The lowering therefore splits the authored text with
//! the same grammar the shipped splitter uses
//! (`crates/vize_atelier_core/src/transforms/v_for.rs`,
//! `find_for_separator` / `split_top_level_aliases`, strict mode — no
//! `template_syntax_quirks`), then admits each **sub-slice** through the
//! shared rule ([`super::expr`]); a value that cannot split at all rides
//! whole as `Opaque(ForValue)` with pessimal semantics.

/// The split of a v-for value: byte ranges of the alias part and the
/// source part inside the value text.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct ForSplit {
    /// End of the alias text (before the separator's whitespace).
    pub alias_end: usize,
    /// Start of the source text (after the separator's whitespace).
    pub source_start: usize,
}

/// Find the first viable ` in ` / ` of ` separator: the keyword with
/// whitespace on both sides, exactly the shipped grammar.
pub(crate) fn split_for(content: &str) -> Option<ForSplit> {
    let chars: alloc::vec::Vec<(usize, char)> = content.char_indices().collect();
    for keyword_idx in 0..chars.len().saturating_sub(1) {
        match (chars[keyword_idx].1, chars[keyword_idx + 1].1) {
            ('i', 'n') | ('o', 'f') => {}
            _ => continue,
        }
        let has_space_before = keyword_idx > 0 && chars[keyword_idx - 1].1.is_whitespace();
        let after_keyword_idx = keyword_idx + 2;
        let has_space_after = chars
            .get(after_keyword_idx)
            .is_some_and(|(_, ch)| ch.is_whitespace());
        if !has_space_before || !has_space_after {
            continue;
        }
        let mut alias_idx = keyword_idx;
        while alias_idx > 0 && chars[alias_idx - 1].1.is_whitespace() {
            alias_idx -= 1;
        }
        let alias_end = chars
            .get(alias_idx)
            .map(|(byte_idx, _)| *byte_idx)
            .unwrap_or(content.len());
        let mut source_idx = after_keyword_idx;
        while source_idx < chars.len() && chars[source_idx].1.is_whitespace() {
            source_idx += 1;
        }
        let source_start = chars.get(source_idx)?.0;
        return Some(ForSplit {
            alias_end,
            source_start,
        });
    }
    None
}

/// Split the alias part into its top-level positions (value, key, index).
/// Strict grammar: parentheses strip only as a matched pair; a lone
/// paren is malformed (`None`), matching the shipped splitter's default
/// (the `template_syntax_quirks` compatibility path is deliberately not
/// offered here).
pub(crate) fn split_aliases(alias: &str) -> Option<alloc::vec::Vec<&str>> {
    let trimmed = alias.trim();
    if trimmed.is_empty() {
        return Some(alloc::vec::Vec::new());
    }
    let starts = trimmed.starts_with('(');
    let ends = trimmed.ends_with(')');
    let inner = if starts && ends {
        if trimmed.len() < 2 {
            return None;
        }
        &trimmed[1..trimmed.len() - 1]
    } else if starts || ends {
        return None;
    } else {
        trimmed
    };
    Some(split_top_level(inner.trim()))
}

/// Split on top-level commas, string- and bracket-aware.
fn split_top_level(input: &str) -> alloc::vec::Vec<&str> {
    let bytes = input.as_bytes();
    let mut aliases = alloc::vec::Vec::with_capacity(3);
    let mut start = 0usize;
    let mut paren = 0u32;
    let mut brace = 0u32;
    let mut bracket = 0u32;
    let mut in_string: Option<u8> = None;
    let mut escaped = false;
    for (idx, &byte) in bytes.iter().enumerate() {
        if let Some(quote) = in_string {
            if escaped {
                escaped = false;
                continue;
            }
            if byte == b'\\' {
                escaped = true;
                continue;
            }
            if byte == quote {
                in_string = None;
            }
            continue;
        }
        match byte {
            b'\'' | b'"' | b'`' => in_string = Some(byte),
            b'(' => paren += 1,
            b')' => paren = paren.saturating_sub(1),
            b'{' => brace += 1,
            b'}' => brace = brace.saturating_sub(1),
            b'[' => bracket += 1,
            b']' => bracket = bracket.saturating_sub(1),
            b',' if paren == 0 && brace == 0 && bracket == 0 => {
                aliases.push(input[start..idx].trim());
                start = idx + 1;
            }
            _ => {}
        }
    }
    aliases.push(input[start..].trim());
    aliases
}

#[cfg(test)]
mod tests {
    use super::{split_aliases, split_for};
    use alloc::vec;

    fn split(content: &str) -> (&str, &str) {
        let s = split_for(content).expect("the value splits");
        (&content[..s.alias_end], &content[s.source_start..])
    }

    #[test]
    fn splits_at_the_first_viable_keyword() {
        assert_eq!(split("item in items"), ("item", "items"));
        assert_eq!(split("item of items"), ("item", "items"));
        // The recorded disagreement: Vue reads alias `a`, source
        // `b in c`; JS `in` associates left and would read `(a in b)`.
        assert_eq!(split("a in b in c"), ("a", "b in c"));
    }

    #[test]
    fn keywords_need_whitespace_on_both_sides() {
        assert_eq!(split_for("items"), None);
        assert_eq!(split_for("in items"), None);
        assert_eq!(split_for("kind of"), None);
        assert_eq!(split("index in indexes"), ("index", "indexes"));
    }

    #[test]
    fn aliases_split_at_top_level_commas_only() {
        assert_eq!(
            split_aliases("(item, key, index)"),
            Some(vec!["item", "key", "index"])
        );
        assert_eq!(split_aliases("item, index"), Some(vec!["item", "index"]));
        assert_eq!(split_aliases("({ a, b }, i)"), Some(vec!["{ a, b }", "i"]));
        assert_eq!(split_aliases("[a, b]"), Some(vec!["[a, b]"]));
        assert_eq!(split_aliases(""), Some(vec![]));
    }

    #[test]
    fn a_lone_paren_is_malformed_in_strict_grammar() {
        assert_eq!(split_aliases("(item"), None);
        assert_eq!(split_aliases("item)"), None);
    }
}
