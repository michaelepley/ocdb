abstract class BaseRoute {
    abstract isGroup(): boolean;
    constructor(public label: string) { this.label = label; }
}

abstract class BaseRouteLink extends BaseRoute {
    isGroup(): boolean { return false };
    abstract routesTo(productId?: string): string;
    abstract matches(url: string): boolean;
    abstract hasChilds(): boolean;
}

class BasicRoute extends BaseRouteLink {
    constructor(label: string, public to: string) {
        super(label);
        this.to = to;
    }
    routesTo(_unused?:string): string {
        return this.to;
    }
    matches(url: string): boolean {
        return this.to == url
    }
    hasChilds(): boolean { return false; }
}

class ProductRoute extends BaseRouteLink {
    constructor(label: string, public productTo: string, public subRoutes?: ProductRoute[]) {
        super(label);
        this.productTo = productTo;
        this.subRoutes = subRoutes;
    }
    routesTo(productId?:string): string {
        if (productId) {
            return this.productTo.replace('select', productId)
        } else {
            return this.productTo
        }
    }
    matches(url: string): boolean {
        const matcher = this.productTo.replace('select', '[\\w-]+');
        return url.search(matcher) != -1;
    }
    hasChilds(): boolean { return this.subRoutes !== undefined }
}

class RouterGroup extends BaseRoute {
    isGroup(): boolean { return true };
    constructor(label: string, public routes: BasicRoute[]) {
        super(label);
        this.routes = routes;
    }
}

export { BaseRoute, BaseRouteLink, BasicRoute, ProductRoute, RouterGroup }
