use vize_doctor::{
    AnalysisProvenance, DoctorCategory, DoctorFilterSpec, DoctorFinding, FindingAssessment,
    FindingConfidence, FindingImpact, FindingSeverity, HealthPenalty, RuleCost, SourceLocation,
};
use vize_s0::{String, cstr};

pub fn scenario(kind: &str, count: usize) -> (DoctorFilterSpec, Vec<DoctorFinding>, Vec<bool>) {
    let patterns: Vec<String> = (0..count)
        .map(|index| match kind {
            "rule-literal" => cstr!("VIZE_DOCTOR_RULE_{index:03}"),
            "rule-regex" => cstr!("VIZE_DOCTOR_RULE_{index:03}_[AB]"),
            "path-prefix" => cstr!("packages/app-{index:03}/**"),
            "path-suffix" => cstr!("**/app-{index:03}/components/Panel.vue"),
            _ => cstr!("packages/app-{index:03}/src/[AB]*.vue"),
        })
        .collect();
    let spec = if kind.starts_with("rule-") {
        DoctorFilterSpec {
            rules: patterns,
            ..DoctorFilterSpec::default()
        }
    } else {
        DoctorFilterSpec {
            paths: patterns,
            ..DoctorFilterSpec::default()
        }
    };
    let mut findings = Vec::new();
    let mut expected = Vec::new();
    for candidate in 0..64 {
        let index = match candidate % 4 {
            0 => 0,
            1 => count.saturating_sub(1),
            2 => count / 2,
            _ => count + candidate,
        };
        let code = match kind {
            "rule-literal" => cstr!("VIZE_DOCTOR_RULE_{index:03}"),
            "rule-regex" => cstr!("VIZE_DOCTOR_RULE_{index:03}_A"),
            _ => "VIZE_DOCTOR_PERFORMANCE_001".into(),
        };
        let path = match kind {
            "path-prefix" => cstr!("packages/app-{index:03}/src/组件/Panel.vue"),
            "path-suffix" => cstr!("packages/日本語/app-{index:03}/components/Panel.vue"),
            "path-regex" => cstr!("packages/app-{index:03}/src/BPanel.vue"),
            _ => "packages/account/src/Login.vue".into(),
        };
        findings.push(DoctorFinding::new(
            code,
            DoctorCategory::Performance,
            FindingAssessment::new(
                FindingSeverity::Warning,
                FindingConfidence::High,
                FindingImpact::Medium,
                HealthPenalty::new(1, "Measured filter cost"),
            ),
            SourceLocation::new(path, candidate as u32, candidate as u32 + 1),
            "Planted filter finding",
            "Repeated rule-code and source-path filtering",
            AnalysisProvenance::new("filter-benchmark", RuleCost::Low),
        ));
        expected.push(candidate % 4 != 3);
    }
    (spec, findings, expected)
}
