export function slugify(value) {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}
export function primaryDisplayName(item) {
    return item.name ?? item.label ?? "";
}
export function secondaryDisplayName(child) {
    return child.name ?? child.label ?? "";
}
export function resolvePrimaryId(item, index) {
    if (item.id)
        return item.id;
    const base = slugify(primaryDisplayName(item));
    return base || `primary-${index}`;
}
export function resolveSecondaryId(child, parentId, index) {
    if (child.id)
        return child.id;
    const base = slugify(secondaryDisplayName(child));
    return base ? `${parentId}-${base}` : `${parentId}-child-${index}`;
}
export function resolveLink(link, legacy) {
    if (link)
        return link;
    if (legacy.href)
        return { type: "href", href: legacy.href };
    if (legacy.routeRef)
        return { type: "routerLink", routerLink: legacy.routeRef };
    return undefined;
}
export function buildNavigateTarget(itemId, name, parentItemId, link, legacy) {
    const resolved = resolveLink(link, legacy);
    return {
        itemId,
        parentItemId,
        name,
        link: resolved,
        href: legacy.href,
        routeRef: legacy.routeRef,
    };
}
export function buildSelectionDetail(level, itemId, parentItemId, name, link, legacy) {
    const resolved = resolveLink(link, legacy);
    return {
        level,
        itemId,
        parentItemId,
        name,
        link: resolved,
        href: legacy.href,
        routeRef: legacy.routeRef,
    };
}
export function resolveInitialSelectedKey(list, defaultSelectedItemId) {
    if (!defaultSelectedItemId)
        return null;
    for (let i = 0; i < list.length; i++) {
        if (resolvePrimaryId(list[i], i) === defaultSelectedItemId) {
            return defaultSelectedItemId;
        }
    }
    return null;
}
export function toStateClass(state) {
    return state
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");
}
