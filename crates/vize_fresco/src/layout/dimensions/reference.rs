//! Frozen std-parser behavior from the two NAPI dimension adapters.

use super::super::{Dimension, LengthPercentageAuto};

pub(super) fn dimension(value: &str) -> Dimension {
    if value == "auto" {
        return Dimension::Auto;
    }
    if let Some(percent) = value.strip_suffix('%')
        && let Ok(number) = percent.parse::<f32>()
    {
        return Dimension::Percent(number);
    }
    value
        .parse::<f32>()
        .map_or(Dimension::Auto, Dimension::Points)
}

pub(super) fn length(value: &str) -> LengthPercentageAuto {
    if value == "auto" {
        return LengthPercentageAuto::Auto;
    }
    if let Some(percent) = value.strip_suffix('%')
        && let Ok(number) = percent.parse::<f32>()
    {
        return LengthPercentageAuto::Percent(number);
    }
    value
        .parse::<f32>()
        .map_or(LengthPercentageAuto::Auto, LengthPercentageAuto::Points)
}

pub(super) fn positive_width(value: &str) -> Option<usize> {
    if value == "auto" || value.ends_with('%') {
        return None;
    }
    let number = value.parse::<f32>().ok()?;
    if number.is_finite() && number > 0.0 {
        Some(number.ceil() as usize)
    } else {
        None
    }
}
