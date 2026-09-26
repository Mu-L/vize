//! Shared parsing for the string dimensions accepted by Fresco's NAPI entry points.

use std::num::ParseFloatError;

use super::{Dimension, LengthPercentageAuto};

/// Parse the entire authored string without trimming or normalizing it.
///
/// The decimal fast path preserves the f32 sign and rounding. Rejected inputs
/// use the standard parser so callers retain its empty/invalid error categories.
#[inline]
pub(super) fn parse_f32(value: &str) -> Result<f32, ParseFloatError> {
    fast_float2::parse(value).or_else(|_| value.parse())
}

pub(crate) fn parse_dimension(value: &str) -> Dimension {
    if value == "auto" {
        return Dimension::Auto;
    }
    if let Some(percent) = value.strip_suffix('%')
        && let Ok(number) = parse_f32(percent)
    {
        return Dimension::Percent(number);
    }
    parse_f32(value).map_or(Dimension::Auto, Dimension::Points)
}

pub(crate) fn parse_length_percentage_auto(value: &str) -> LengthPercentageAuto {
    if value == "auto" {
        return LengthPercentageAuto::Auto;
    }
    if let Some(percent) = value.strip_suffix('%')
        && let Ok(number) = parse_f32(percent)
    {
        return LengthPercentageAuto::Percent(number);
    }
    parse_f32(value).map_or(LengthPercentageAuto::Auto, LengthPercentageAuto::Points)
}

pub(crate) fn parse_positive_point_width(value: &str) -> Option<usize> {
    if value == "auto" || value.ends_with('%') {
        return None;
    }
    let number = parse_f32(value).ok()?;
    if number.is_finite() && number > 0.0 {
        Some(number.ceil() as usize)
    } else {
        None
    }
}

#[cfg(test)]
mod benchmark;
#[cfg(test)]
mod corpus;
#[cfg(test)]
mod reference;
#[cfg(test)]
mod tests;
