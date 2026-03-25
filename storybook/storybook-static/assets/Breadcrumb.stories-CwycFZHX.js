import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as d}from"./index-JhL3uwfD.js";import{b as S}from"./useRenderElement-RsBRv27X.js";const w=d.forwardRef(function(n,c){const{className:p,render:s,orientation:r="horizontal",...m}=n,N=d.useMemo(()=>({orientation:r}),[r]);return S("div",n,{state:N,ref:c,props:[{role:"separator","aria-orientation":r},m]})}),B="_nav_aq8w9_1",q="_list_aq8w9_7",I="_item_aq8w9_16",P="_link_aq8w9_22",C="_separator_aq8w9_40",T="_current_aq8w9_47",a={nav:B,list:q,item:I,link:P,separator:C,current:T};function j({items:i,separator:n="/",className:c,...p}){return e.jsx("nav",{"aria-label":"Breadcrumb",className:[a.nav,c].filter(Boolean).join(" "),...p,children:e.jsx("ol",{className:a.list,children:i.map((s,r)=>{const m=r===i.length-1;return e.jsx("li",{className:a.item,children:m?e.jsx("span",{className:a.current,"aria-current":"page",children:s.label}):e.jsxs(e.Fragment,{children:[e.jsx("a",{href:s.href??"#",className:a.link,children:s.label}),e.jsx(w,{className:a.separator,"aria-hidden":"true",children:n})]})},r)})})})}j.__docgenInfo={description:"",methods:[],displayName:"Breadcrumb",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"BreadcrumbItem"}],raw:"BreadcrumbItem[]"},description:""},separator:{required:!1,tsType:{name:"union",raw:'"/" | ">"',elements:[{name:"literal",value:'"/"'},{name:"literal",value:'">"'}]},description:"",defaultValue:{value:'"/"',computed:!1}}},composes:["ComponentProps"]};const L={title:"Synapse/Breadcrumb",component:j,argTypes:{separator:{control:"select",options:["/",">"]}}},t={args:{items:[{label:"Home",href:"/"},{label:"Products",href:"/products"},{label:"Widget Pro"}]}},o={args:{items:[{label:"Home",href:"/"},{label:"Library",href:"/library"},{label:"Components",href:"/library/components"},{label:"Navigation",href:"/library/components/navigation"},{label:"Breadcrumb"}]}},l={args:{items:[{label:"Dashboard",href:"/"},{label:"Settings",href:"/settings"},{label:"Profile"}],separator:">"}};var u,b,h;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "/"
    }, {
      label: "Products",
      href: "/products"
    }, {
      label: "Widget Pro"
    }]
  }
}`,...(h=(b=t.parameters)==null?void 0:b.docs)==null?void 0:h.source}}};var f,g,_;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Home",
      href: "/"
    }, {
      label: "Library",
      href: "/library"
    }, {
      label: "Components",
      href: "/library/components"
    }, {
      label: "Navigation",
      href: "/library/components/navigation"
    }, {
      label: "Breadcrumb"
    }]
  }
}`,...(_=(g=o.parameters)==null?void 0:g.docs)==null?void 0:_.source}}};var v,y,x;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Dashboard",
      href: "/"
    }, {
      label: "Settings",
      href: "/settings"
    }, {
      label: "Profile"
    }],
    separator: ">"
  }
}`,...(x=(y=l.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};const R=["ThreeItems","FiveItems","ChevronSeparator"];export{l as ChevronSeparator,o as FiveItems,t as ThreeItems,R as __namedExportsOrder,L as default};
