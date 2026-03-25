import{j as e}from"./jsx-runtime-D_zvdyIk.js";const k="_footer_1a86w_1",x="_columns_1a86w_8",j="_column_1a86w_8",A="_item_1a86w_24",T="_link_1a86w_28",P="_copyright_1a86w_47",r={footer:k,columns:x,column:j,item:A,link:T,copyright:P};function b({links:a=[],copyright:l,className:d,...S}){return e.jsxs("footer",{className:[r.footer,d].filter(Boolean).join(" "),...S,children:[a.length>0&&e.jsx("div",{className:r.columns,children:a.map((_,v)=>e.jsx("ul",{className:r.column,children:_.map((t,C)=>e.jsx("li",{className:r.item,children:e.jsx("a",{href:t.href,className:r.link,children:t.label})},C))},v))}),l&&e.jsx("div",{className:r.copyright,children:e.jsx("span",{children:l})})]})}b.__docgenInfo={description:"",methods:[],displayName:"Footer",props:{links:{required:!1,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"FooterLink"}],raw:"FooterLink[]"}],raw:"FooterLink[][]"},description:"",defaultValue:{value:"[]",computed:!1}},copyright:{required:!1,tsType:{name:"string"},description:""}},composes:["ComponentProps"]};const D={title:"Synapse/Footer",component:b,parameters:{layout:"fullscreen"}},s={args:{links:[[{label:"Documentation",href:"/docs"},{label:"Tutorials",href:"/tutorials"},{label:"API Reference",href:"/api"},{label:"Changelog",href:"/changelog"}],[{label:"Community",href:"/community"},{label:"Support",href:"/support"},{label:"GitHub",href:"https://github.com"},{label:"Discussions",href:"/discussions"}],[{label:"Privacy Policy",href:"/privacy"},{label:"Terms of Service",href:"/terms"},{label:"Cookie Settings",href:"/cookies"},{label:"Accessibility",href:"/accessibility"}]],copyright:"© 2026 Synapse Design System. All rights reserved."}},n={args:{links:[[{label:"Privacy",href:"/privacy"},{label:"Terms",href:"/terms"},{label:"Contact",href:"/contact"}]],copyright:"© 2026 Synapse"}},o={args:{copyright:"© 2026 Synapse Design System. All rights reserved."}};var i,c,m;s.parameters={...s.parameters,docs:{...(i=s.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    links: [[{
      label: "Documentation",
      href: "/docs"
    }, {
      label: "Tutorials",
      href: "/tutorials"
    }, {
      label: "API Reference",
      href: "/api"
    }, {
      label: "Changelog",
      href: "/changelog"
    }], [{
      label: "Community",
      href: "/community"
    }, {
      label: "Support",
      href: "/support"
    }, {
      label: "GitHub",
      href: "https://github.com"
    }, {
      label: "Discussions",
      href: "/discussions"
    }], [{
      label: "Privacy Policy",
      href: "/privacy"
    }, {
      label: "Terms of Service",
      href: "/terms"
    }, {
      label: "Cookie Settings",
      href: "/cookies"
    }, {
      label: "Accessibility",
      href: "/accessibility"
    }]],
    copyright: "\\u00a9 2026 Synapse Design System. All rights reserved."
  }
}`,...(m=(c=s.parameters)==null?void 0:c.docs)==null?void 0:m.source}}};var p,h,u;n.parameters={...n.parameters,docs:{...(p=n.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    links: [[{
      label: "Privacy",
      href: "/privacy"
    }, {
      label: "Terms",
      href: "/terms"
    }, {
      label: "Contact",
      href: "/contact"
    }]],
    copyright: "\\u00a9 2026 Synapse"
  }
}`,...(u=(h=n.parameters)==null?void 0:h.docs)==null?void 0:u.source}}};var f,y,g;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    copyright: "\\u00a9 2026 Synapse Design System. All rights reserved."
  }
}`,...(g=(y=o.parameters)==null?void 0:y.docs)==null?void 0:g.source}}};const N=["ThreeColumns","SingleColumn","CopyrightOnly"];export{o as CopyrightOnly,n as SingleColumn,s as ThreeColumns,N as __namedExportsOrder,D as default};
