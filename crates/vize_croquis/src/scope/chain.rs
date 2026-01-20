//! Scope chain management for Vue templates and scripts.
//!
//! This module provides the core scope management functionality:
//! - `Scope` - A single scope in the scope chain
//! - `ScopeChain` - Manages the hierarchical scope chain

use vize_carton::{smallvec, CompactString, FxHashMap, SmallVec};
use vize_relief::BindingType;

use super::types::{
    BlockScopeData, CallbackScopeData, ClientOnlyScopeData, ClosureScopeData,
    EventHandlerScopeData, ExternalModuleScopeData, JsGlobalScopeData, NonScriptSetupScopeData,
    ParentScopes, ScopeBinding, ScopeData, ScopeId, ScopeKind, ScriptSetupScopeData, Span,
    UniversalScopeData, VForScopeData, VSlotScopeData, VueGlobalScopeData,
};

/// A single scope in the scope chain
#[derive(Debug)]
pub struct Scope {
    /// Unique identifier
    pub id: ScopeId,
    /// Parent scopes (empty for root, can have multiple for template scopes)
    /// First parent is the lexical parent, additional parents are accessible scopes (e.g., Vue globals)
    pub parents: ParentScopes,
    /// Kind of scope
    pub kind: ScopeKind,
    /// Bindings declared in this scope
    bindings: FxHashMap<CompactString, ScopeBinding>,
    /// Scope-specific data
    data: ScopeData,
    /// Source span
    pub span: Span,
}

impl Scope {
    /// Create a new scope with single parent
    #[inline]
    pub fn new(id: ScopeId, parent: Option<ScopeId>, kind: ScopeKind) -> Self {
        Self {
            id,
            parents: parent.map(|p| smallvec![p]).unwrap_or_default(),
            kind,
            bindings: FxHashMap::default(),
            data: ScopeData::None,
            span: Span::default(),
        }
    }

    /// Create a new scope with multiple parents
    #[inline]
    pub fn with_parents(id: ScopeId, parents: ParentScopes, kind: ScopeKind) -> Self {
        Self {
            id,
            parents,
            kind,
            bindings: FxHashMap::default(),
            data: ScopeData::None,
            span: Span::default(),
        }
    }

    /// Create a new scope with span
    #[inline]
    pub fn with_span(
        id: ScopeId,
        parent: Option<ScopeId>,
        kind: ScopeKind,
        start: u32,
        end: u32,
    ) -> Self {
        Self {
            id,
            parents: parent.map(|p| smallvec![p]).unwrap_or_default(),
            kind,
            bindings: FxHashMap::default(),
            data: ScopeData::None,
            span: Span::new(start, end),
        }
    }

    /// Create a new scope with span and multiple parents
    #[inline]
    pub fn with_span_parents(
        id: ScopeId,
        parents: ParentScopes,
        kind: ScopeKind,
        start: u32,
        end: u32,
    ) -> Self {
        Self {
            id,
            parents,
            kind,
            bindings: FxHashMap::default(),
            data: ScopeData::None,
            span: Span::new(start, end),
        }
    }

    /// Get the primary (lexical) parent
    #[inline]
    pub fn parent(&self) -> Option<ScopeId> {
        self.parents.first().copied()
    }

    /// Add an additional parent scope
    #[inline]
    pub fn add_parent(&mut self, parent: ScopeId) {
        if !self.parents.contains(&parent) {
            self.parents.push(parent);
        }
    }

    /// Set scope-specific data
    #[inline]
    pub fn set_data(&mut self, data: ScopeData) {
        self.data = data;
    }

    /// Get scope-specific data
    #[inline]
    pub fn data(&self) -> &ScopeData {
        &self.data
    }

    /// Add a binding to this scope
    #[inline]
    pub fn add_binding(&mut self, name: CompactString, binding: ScopeBinding) {
        self.bindings.insert(name, binding);
    }

    /// Get a binding by name (only in this scope, not parents)
    #[inline]
    pub fn get_binding(&self, name: &str) -> Option<&ScopeBinding> {
        self.bindings.get(name)
    }

    /// Get a mutable binding by name
    #[inline]
    pub fn get_binding_mut(&mut self, name: &str) -> Option<&mut ScopeBinding> {
        self.bindings.get_mut(name)
    }

    /// Check if this scope has a binding
    #[inline]
    pub fn has_binding(&self, name: &str) -> bool {
        self.bindings.contains_key(name)
    }

    /// Iterate over all bindings in this scope
    #[inline]
    pub fn bindings(&self) -> impl Iterator<Item = (&str, &ScopeBinding)> {
        self.bindings.iter().map(|(k, v)| (k.as_str(), v))
    }

    /// Number of bindings in this scope
    #[inline]
    pub fn binding_count(&self) -> usize {
        self.bindings.len()
    }

    /// Get display name for this scope (includes hook name for ClientOnly scopes)
    pub fn display_name(&self) -> String {
        match (&self.kind, &self.data) {
            (ScopeKind::ClientOnly, ScopeData::ClientOnly(data)) => {
                // Use hook name without "on" prefix: onMounted -> mounted
                data.hook_name
                    .strip_prefix("on")
                    .map(|s| s.to_ascii_lowercase())
                    .unwrap_or_else(|| data.hook_name.to_string())
            }
            _ => self.kind.to_display().to_string(),
        }
    }
}

/// Manages the scope chain during analysis
#[derive(Debug)]
pub struct ScopeChain {
    /// All scopes (indexed by ScopeId)
    scopes: Vec<Scope>,
    /// Current scope ID
    current: ScopeId,
}

impl Default for ScopeChain {
    fn default() -> Self {
        Self::new()
    }
}

/// ECMAScript standard built-in globals (ECMA-262)
const JS_UNIVERSAL_GLOBALS: &[&str] = &[
    "AggregateError",
    "arguments", // Function scope closure
    "Array",
    "ArrayBuffer",
    "AsyncFunction",
    "AsyncGenerator",
    "AsyncGeneratorFunction",
    "AsyncIterator",
    "Atomics",
    "BigInt",
    "BigInt64Array",
    "BigUint64Array",
    "Boolean",
    "console", // Non-standard but universally available
    "DataView",
    "Date",
    "decodeURI",
    "decodeURIComponent",
    "encodeURI",
    "encodeURIComponent",
    "Error",
    "eval",
    "EvalError",
    "Float32Array",
    "Float64Array",
    "Function",
    "Generator",
    "GeneratorFunction",
    "globalThis",
    "Infinity",
    "Int16Array",
    "Int32Array",
    "Int8Array",
    "Intl",
    "isFinite",
    "isNaN",
    "Iterator",
    "JSON",
    "Map",
    "Math",
    "NaN",
    "Number",
    "Object",
    "parseFloat",
    "parseInt",
    "Promise",
    "Proxy",
    "RangeError",
    "ReferenceError",
    "Reflect",
    "RegExp",
    "Set",
    "SharedArrayBuffer",
    "String",
    "Symbol",
    "SyntaxError",
    "this", // Function scope closure
    "TypeError",
    "Uint16Array",
    "Uint32Array",
    "Uint8Array",
    "Uint8ClampedArray",
    "undefined",
    "URIError",
    "WeakMap",
    "WeakSet",
];

impl ScopeChain {
    /// Create a new scope chain with JS universal globals as root
    /// ECMAScript standard built-ins only (ECMA-262)
    #[inline]
    pub fn new() -> Self {
        let mut root = Scope::new(ScopeId::ROOT, None, ScopeKind::JsGlobalUniversal);
        for name in JS_UNIVERSAL_GLOBALS {
            root.add_binding(
                CompactString::new(name),
                ScopeBinding::new(BindingType::JsGlobalUniversal, 0),
            );
        }
        Self {
            scopes: vec![root],
            current: ScopeId::ROOT,
        }
    }

    /// Create with pre-allocated capacity
    #[inline]
    pub fn with_capacity(capacity: usize) -> Self {
        let mut root = Scope::new(ScopeId::ROOT, None, ScopeKind::JsGlobalUniversal);
        for name in JS_UNIVERSAL_GLOBALS {
            root.add_binding(
                CompactString::new(name),
                ScopeBinding::new(BindingType::JsGlobalUniversal, 0),
            );
        }
        let mut scopes = Vec::with_capacity(capacity);
        scopes.push(root);
        Self {
            scopes,
            current: ScopeId::ROOT,
        }
    }

    /// Get the current scope
    #[inline]
    pub fn current_scope(&self) -> &Scope {
        // SAFETY: current is always a valid index
        unsafe { self.scopes.get_unchecked(self.current.as_u32() as usize) }
    }

    /// Get the current scope mutably
    #[inline]
    pub fn current_scope_mut(&mut self) -> &mut Scope {
        let idx = self.current.as_u32() as usize;
        // SAFETY: current is always a valid index
        unsafe { self.scopes.get_unchecked_mut(idx) }
    }

    /// Get a scope by ID
    #[inline]
    pub fn get_scope(&self, id: ScopeId) -> Option<&Scope> {
        self.scopes.get(id.as_u32() as usize)
    }

    /// Get a scope by ID (unchecked)
    ///
    /// # Safety
    /// Caller must ensure id is valid
    #[inline]
    pub unsafe fn get_scope_unchecked(&self, id: ScopeId) -> &Scope {
        self.scopes.get_unchecked(id.as_u32() as usize)
    }

    /// Current scope ID
    #[inline]
    pub const fn current_id(&self) -> ScopeId {
        self.current
    }

    /// Number of scopes
    #[inline]
    pub fn len(&self) -> usize {
        self.scopes.len()
    }

    /// Check if empty (only root scope)
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.scopes.len() == 1
    }

    /// Iterate over all scopes
    #[inline]
    pub fn iter(&self) -> impl Iterator<Item = &Scope> {
        self.scopes.iter()
    }

    /// Find a scope by kind (returns the first match)
    #[inline]
    pub fn find_scope_by_kind(&self, kind: ScopeKind) -> Option<ScopeId> {
        self.scopes.iter().find(|s| s.kind == kind).map(|s| s.id)
    }

    /// Get mutable scope by ID
    #[inline]
    pub fn get_scope_mut(&mut self, id: ScopeId) -> Option<&mut Scope> {
        self.scopes.get_mut(id.as_u32() as usize)
    }

    /// Enter a new scope
    #[inline]
    pub fn enter_scope(&mut self, kind: ScopeKind) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let scope = Scope::new(id, Some(self.current), kind);
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a new scope with Vue global access (for template scopes)
    #[inline]
    pub fn enter_scope_with_vue_global(&mut self, kind: ScopeKind) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut parents: ParentScopes = smallvec![self.current];

        // Add Vue global scope as additional parent if it exists
        if let Some(vue_id) = self.find_scope_by_kind(ScopeKind::VueGlobal) {
            if !parents.contains(&vue_id) {
                parents.push(vue_id);
            }
        }

        let scope = Scope::with_parents(id, parents, kind);
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Exit the current scope and return to primary parent
    #[inline]
    pub fn exit_scope(&mut self) {
        if let Some(parent) = self.current_scope().parent() {
            self.current = parent;
        }
    }

    /// Build parents list including Vue global for template scopes
    fn build_template_parents(&self) -> ParentScopes {
        let mut parents: ParentScopes = smallvec![self.current];
        if let Some(vue_id) = self.find_scope_by_kind(ScopeKind::VueGlobal) {
            if !parents.contains(&vue_id) {
                parents.push(vue_id);
            }
        }
        parents
    }

    /// Enter a v-for scope with the given data
    pub fn enter_v_for_scope(&mut self, data: VForScopeData, start: u32, end: u32) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let parents = self.build_template_parents();
        let mut scope = Scope::with_span_parents(id, parents, ScopeKind::VFor, start, end);

        // Add value alias as binding
        scope.add_binding(
            data.value_alias.clone(),
            ScopeBinding::new(BindingType::SetupConst, start),
        );

        // Add key alias if present
        if let Some(ref key) = data.key_alias {
            scope.add_binding(
                key.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        // Add index alias if present
        if let Some(ref index) = data.index_alias {
            scope.add_binding(
                index.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::VFor(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a v-slot scope with the given data
    pub fn enter_v_slot_scope(&mut self, data: VSlotScopeData, start: u32, end: u32) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let parents = self.build_template_parents();
        let mut scope = Scope::with_span_parents(id, parents, ScopeKind::VSlot, start, end);

        // Add prop names as bindings
        for prop_name in &data.prop_names {
            scope.add_binding(
                prop_name.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::VSlot(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter an event handler scope
    pub fn enter_event_handler_scope(
        &mut self,
        data: EventHandlerScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let parents = self.build_template_parents();
        let mut scope = Scope::with_span_parents(id, parents, ScopeKind::EventHandler, start, end);

        // Add implicit $event binding if applicable
        if data.has_implicit_event {
            scope.add_binding(
                CompactString::const_new("$event"),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        // Add explicit parameter names as bindings
        for param_name in &data.param_names {
            scope.add_binding(
                param_name.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::EventHandler(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a callback/arrow function scope (script context - no vue global)
    pub fn enter_callback_scope(
        &mut self,
        data: CallbackScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        // Script callbacks only have current scope as parent (no vue global)
        let mut scope = Scope::with_span(id, Some(self.current), ScopeKind::Callback, start, end);

        // Add parameter names as bindings
        for param_name in &data.param_names {
            scope.add_binding(
                param_name.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::Callback(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a callback scope with vue global access (for template inline expressions)
    pub fn enter_template_callback_scope(
        &mut self,
        data: CallbackScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let parents = self.build_template_parents();
        let mut scope = Scope::with_span_parents(id, parents, ScopeKind::Callback, start, end);

        // Add parameter names as bindings
        for param_name in &data.param_names {
            scope.add_binding(
                param_name.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::Callback(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a module scope
    pub fn enter_module_scope(&mut self, start: u32, end: u32) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let scope = Scope::with_span(id, Some(self.current), ScopeKind::Module, start, end);
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Set the current scope directly (used for switching between sibling scopes)
    #[inline]
    pub fn set_current(&mut self, id: ScopeId) {
        self.current = id;
    }

    /// Enter a script setup scope
    pub fn enter_script_setup_scope(
        &mut self,
        data: ScriptSetupScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope =
            Scope::with_span(id, Some(self.current), ScopeKind::ScriptSetup, start, end);
        scope.set_data(ScopeData::ScriptSetup(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a non-script-setup scope (Options API, regular script)
    pub fn enter_non_script_setup_scope(
        &mut self,
        data: NonScriptSetupScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(
            id,
            Some(self.current),
            ScopeKind::NonScriptSetup,
            start,
            end,
        );
        scope.set_data(ScopeData::NonScriptSetup(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a universal scope (SSR - runs on both server and client)
    pub fn enter_universal_scope(
        &mut self,
        data: UniversalScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(id, Some(self.current), ScopeKind::Universal, start, end);
        scope.set_data(ScopeData::Universal(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a client-only scope (onMounted, onBeforeUnmount, etc.)
    /// Parents: current scope + !js (browser globals)
    pub fn enter_client_only_scope(
        &mut self,
        data: ClientOnlyScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);

        // Build parents: current scope + !js (browser globals)
        let mut parents: ParentScopes = smallvec![self.current];
        if let Some(browser_id) = self.find_scope_by_kind(ScopeKind::JsGlobalBrowser) {
            if !parents.contains(&browser_id) {
                parents.push(browser_id);
            }
        }

        let mut scope = Scope::with_span_parents(id, parents, ScopeKind::ClientOnly, start, end);
        scope.set_data(ScopeData::ClientOnly(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a JavaScript global scope with specific runtime
    pub fn enter_js_global_scope(
        &mut self,
        data: JsGlobalScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let scope_kind = data.runtime.to_scope_kind();
        let binding_type = data.runtime.to_binding_type();
        let mut scope = Scope::with_span(id, Some(self.current), scope_kind, start, end);

        // Add JS globals as bindings with runtime-specific type
        for global in &data.globals {
            scope.add_binding(global.clone(), ScopeBinding::new(binding_type, start));
        }

        scope.set_data(ScopeData::JsGlobal(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a Vue global scope
    pub fn enter_vue_global_scope(
        &mut self,
        data: VueGlobalScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(id, Some(self.current), ScopeKind::VueGlobal, start, end);

        // Add Vue globals as bindings
        for global in &data.globals {
            scope.add_binding(
                global.clone(),
                ScopeBinding::new(BindingType::VueGlobal, start),
            );
        }

        scope.set_data(ScopeData::VueGlobal(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter an external module scope
    pub fn enter_external_module_scope(
        &mut self,
        data: ExternalModuleScopeData,
        start: u32,
        end: u32,
    ) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(
            id,
            Some(self.current),
            ScopeKind::ExternalModule,
            start,
            end,
        );
        scope.set_data(ScopeData::ExternalModule(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a closure scope (function declaration, function expression, arrow function)
    pub fn enter_closure_scope(&mut self, data: ClosureScopeData, start: u32, end: u32) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(id, Some(self.current), ScopeKind::Closure, start, end);

        // Add parameter names as bindings
        for param in &data.param_names {
            scope.add_binding(
                param.clone(),
                ScopeBinding::new(BindingType::SetupConst, start),
            );
        }

        scope.set_data(ScopeData::Closure(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Enter a block scope (if, for, switch, try, catch, etc.)
    pub fn enter_block_scope(&mut self, data: BlockScopeData, start: u32, end: u32) -> ScopeId {
        let id = ScopeId::new(self.scopes.len() as u32);
        let mut scope = Scope::with_span(id, Some(self.current), ScopeKind::Block, start, end);
        scope.set_data(ScopeData::Block(data));
        self.scopes.push(scope);
        self.current = id;
        id
    }

    /// Look up a binding by name, searching through all parent scopes
    /// Uses BFS to search all accessible scopes (lexical parents + additional parents like Vue globals)
    #[inline]
    pub fn lookup(&self, name: &str) -> Option<(&Scope, &ScopeBinding)> {
        let mut visited: SmallVec<[ScopeId; 8]> = SmallVec::new();
        let mut queue: SmallVec<[ScopeId; 8]> = smallvec![self.current];

        while let Some(id) = queue.pop() {
            if visited.contains(&id) {
                continue;
            }
            visited.push(id);

            let scope = unsafe { self.scopes.get_unchecked(id.as_u32() as usize) };
            if let Some(binding) = scope.get_binding(name) {
                return Some((scope, binding));
            }

            // Add all parents to queue
            for &parent_id in &scope.parents {
                if !visited.contains(&parent_id) {
                    queue.push(parent_id);
                }
            }
        }

        None
    }

    /// Check if a name is defined in any accessible scope
    #[inline]
    pub fn is_defined(&self, name: &str) -> bool {
        self.lookup(name).is_some()
    }

    /// Add a binding to the current scope
    #[inline]
    pub fn add_binding(&mut self, name: CompactString, binding: ScopeBinding) {
        self.current_scope_mut().add_binding(name, binding);
    }

    /// Mark a binding as used (searches through all parent scopes)
    pub fn mark_used(&mut self, name: &str) {
        let mut visited: SmallVec<[ScopeId; 8]> = SmallVec::new();
        let mut queue: SmallVec<[ScopeId; 8]> = smallvec![self.current];

        while let Some(id) = queue.pop() {
            if visited.contains(&id) {
                continue;
            }
            visited.push(id);

            let scope = &mut self.scopes[id.as_u32() as usize];
            if let Some(binding) = scope.get_binding_mut(name) {
                binding.mark_used();
                return;
            }

            // Collect parents before continuing (to avoid borrow issues)
            let parents: SmallVec<[ScopeId; 2]> = scope.parents.clone();
            for parent_id in parents {
                if !visited.contains(&parent_id) {
                    queue.push(parent_id);
                }
            }
        }
    }

    /// Check if a binding has been marked as used (searches through all scopes)
    pub fn is_used(&self, name: &str) -> bool {
        for scope in &self.scopes {
            if let Some(binding) = scope.get_binding(name) {
                return binding.is_used();
            }
        }
        false
    }

    /// Mark a binding as mutated (searches through all parent scopes)
    pub fn mark_mutated(&mut self, name: &str) {
        let mut visited: SmallVec<[ScopeId; 8]> = SmallVec::new();
        let mut queue: SmallVec<[ScopeId; 8]> = smallvec![self.current];

        while let Some(id) = queue.pop() {
            if visited.contains(&id) {
                continue;
            }
            visited.push(id);

            let scope = &mut self.scopes[id.as_u32() as usize];
            if let Some(binding) = scope.get_binding_mut(name) {
                binding.mark_mutated();
                return;
            }

            // Collect parents before continuing (to avoid borrow issues)
            let parents: SmallVec<[ScopeId; 2]> = scope.parents.clone();
            for parent_id in parents {
                if !visited.contains(&parent_id) {
                    queue.push(parent_id);
                }
            }
        }
    }

    /// Calculate the depth of a scope (distance from root via primary parent chain)
    #[inline]
    pub fn depth(&self, id: ScopeId) -> u32 {
        let mut depth = 0u32;
        let mut current_id = self.get_scope(id).and_then(|s| s.parent());
        while let Some(pid) = current_id {
            depth += 1;
            current_id = self.get_scope(pid).and_then(|s| s.parent());
        }
        depth
    }
}

#[cfg(test)]
#[path = "chain_tests.rs"]
mod tests;
