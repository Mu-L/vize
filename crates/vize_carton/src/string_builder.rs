//! String builder utilities for efficient string construction.
//!
//! Provides macros for building strings without excessive allocations,
//! avoiding the overhead of `format!` by using direct `push_str` operations.

/// Push multiple items to a string efficiently.
///
/// This macro expands to a series of `push_str` and `push` calls,
/// avoiding the allocation overhead of `format!`.
///
/// # Examples
///
/// ```
/// use vize_carton::push_all;
///
/// let mut s = String::new();
/// push_all!(s, "Hello, ", "world", "!");
/// assert_eq!(s, "Hello, world!");
/// ```
///
/// With numeric values (using write! internally):
///
/// ```
/// use vize_carton::push_all;
///
/// let mut s = String::new();
/// let count = 42u32;
/// push_all!(s, "Count: ", @count, " items");
/// assert_eq!(s, "Count: 42 items");
/// ```
///
/// With single characters:
///
/// ```
/// use vize_carton::push_all;
///
/// let mut s = String::new();
/// push_all!(s, "a", #':', "b");
/// assert_eq!(s, "a:b");
/// ```
#[macro_export]
macro_rules! push_all {
    // Base case: no more items
    ($s:expr $(,)?) => {};

    // Single character literal (prefixed with #)
    ($s:expr, # $ch:literal $(, $($rest:tt)*)?) => {
        $s.push($ch);
        $crate::push_all!($s $(, $($rest)*)?);
    };

    // Numeric value using write! (prefixed with @)
    ($s:expr, @ $num:expr $(, $($rest:tt)*)?) => {
        {
            use ::std::fmt::Write;
            let _ = write!($s, "{}", $num);
        }
        $crate::push_all!($s $(, $($rest)*)?);
    };

    // String literal or &str (catch-all for expressions)
    ($s:expr, $item:expr $(, $($rest:tt)*)?) => {
        $s.push_str($item);
        $crate::push_all!($s $(, $($rest)*)?);
    };
}

/// Push a line (with newline) to a string efficiently.
///
/// Equivalent to `push_all!` followed by a newline character.
///
/// # Examples
///
/// ```
/// use vize_carton::push_line;
///
/// let mut s = String::new();
/// push_line!(s, "Hello, world!");
/// assert_eq!(s, "Hello, world!\n");
/// ```
#[macro_export]
macro_rules! push_line {
    ($s:expr $(, $($items:tt)*)?) => {
        $crate::push_all!($s $(, $($items)*)?);
        $s.push('\n');
    };
}

#[cfg(test)]
mod tests {
    #[test]
    fn test_push_all_strings() {
        let mut s = std::string::String::new();
        push_all!(s, "Hello", ", ", "world", "!");
        assert_eq!(s, "Hello, world!");
    }

    #[test]
    fn test_push_all_with_char() {
        let mut s = std::string::String::new();
        push_all!(s, "a", #':', "b");
        assert_eq!(s, "a:b");
    }

    #[test]
    fn test_push_all_with_number() {
        let mut s = std::string::String::new();
        let n = 42u32;
        push_all!(s, "count: ", @n);
        assert_eq!(s, "count: 42");
    }

    #[test]
    fn test_push_all_mixed() {
        let mut s = std::string::String::new();
        let start = 10usize;
        let end = 20usize;
        push_all!(s, "range: ", @start, #':', @end);
        assert_eq!(s, "range: 10:20");
    }

    #[test]
    fn test_push_line() {
        let mut s = std::string::String::new();
        push_line!(s, "Hello");
        push_line!(s, "World");
        assert_eq!(s, "Hello\nWorld\n");
    }

    #[test]
    fn test_push_all_empty() {
        let s = std::string::String::from("start");
        push_all!(s);
        assert_eq!(s, "start");
    }
}
