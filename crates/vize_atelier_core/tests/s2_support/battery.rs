//! The committed v-if battery the P2-9 series 1 comparator runs — the
//! same sources in the plain witness and the corpus entry, so a
//! feature-wiring regression fails loudly in both lanes.

/// (name, template source). Each names the projection class it pins.
pub const BATTERY: &[(&str, &str)] = &[
    ("simple-if", r#"<div v-if="show">on</div>"#),
    (
        "if-else",
        r#"<div v-if="show">on</div><div v-else>off</div>"#,
    ),
    (
        "full-chain",
        r#"<a v-if="x === 1">1</a><b v-else-if="x === 2">2</b><i v-else>other</i>"#,
    ),
    (
        "static-keys",
        r#"<p v-if="a" key="one">1</p><p v-else-if="b" key="two">2</p><p v-else key="three">3</p>"#,
    ),
    (
        "duplicate-keys",
        r#"<p v-if="a" key="dup">1</p><p v-else key="dup">2</p>"#,
    ),
    ("bare-keys", r#"<p v-if="a" key>1</p><p v-else key>2</p>"#),
    (
        "dynamic-keys",
        r#"<p v-if="a" :key="ka">1</p><p v-else :key="kb">2</p>"#,
    ),
    (
        "template-if",
        r#"<template v-if="a"><p>1</p><p>2</p></template><div v-else>3</div>"#,
    ),
    (
        "template-if-key",
        r#"<template v-if="a" key="t"><p>1</p></template><div v-else key="d">2</div>"#,
    ),
    (
        "template-child-key",
        r#"<template v-if="a"><div key="z">1</div></template><p v-else>2</p>"#,
    ),
    (
        "if-and-for",
        r#"<li v-if="ready" v-for="item in items" key="row">{{ item }}</li>"#,
    ),
    (
        "nested-chains",
        r#"<div v-if="outer"><span v-if="inner" key="i">a</span><span v-else>b</span></div><div v-else>c</div>"#,
    ),
    (
        "comment-gap",
        "<p v-if=\"a\">1</p><!-- between branches -->\n<p v-else>2</p>",
    ),
    (
        "component-branches",
        r#"<Panel v-if="a" key="p">x</Panel><Drawer v-else key="d">y</Drawer>"#,
    ),
    (
        "slot-outlet-key",
        r#"<slot v-if="a" key="s"></slot><p v-else>fallback</p>"#,
    ),
    (
        "padded-condition",
        "<div v-if=\"  ready && !done  \">padded</div>",
    ),
    (
        "multiline-condition",
        "<div v-if=\"mode === 'a' ||\n  mode === 'b'\">m</div>",
    ),
    (
        "deep-siting",
        r#"<ul><li v-for="i in xs"><em v-if="i.ok" key="ok">y</em><em v-else key="no">n</em></li></ul>"#,
    ),
];
