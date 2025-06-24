
export interface NavigationItem {
    label: string
    icon: string
    route?: string
    active?: boolean
    children?: NavigationItem[]
    expanded?: boolean
}

export interface NavigationSection {
    title: string
    items: NavigationItem[]
}