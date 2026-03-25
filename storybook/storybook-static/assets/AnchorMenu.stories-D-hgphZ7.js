import{j as e}from"./jsx-runtime-D_zvdyIk.js";const _="_nav_1e91t_1",y="_heading_1e91t_6",I="_list_1e91t_17",j="_item_1e91t_26",w="_link_1e91t_30",A="_active_1e91t_53",n={nav:_,heading:y,list:I,item:j,link:w,active:A};function s({items:g,className:u,...x}){return e.jsxs("nav",{"aria-label":"On this page",className:[n.nav,u].filter(Boolean).join(" "),...x,children:[e.jsx("span",{className:n.heading,children:"On this page"}),e.jsx("ul",{className:n.list,children:g.map((a,b)=>e.jsx("li",{className:n.item,children:e.jsx("a",{href:a.href,className:[n.link,a.active?n.active:""].filter(Boolean).join(" "),"aria-current":a.active?"true":void 0,children:a.label})},b))})]})}s.__docgenInfo={description:"",methods:[],displayName:"AnchorMenu",props:{items:{required:!0,tsType:{name:"Array",elements:[{name:"AnchorMenuItem"}],raw:"AnchorMenuItem[]"},description:""}},composes:["ComponentProps"]};const O={title:"Synapse/AnchorMenu",component:s},r={args:{items:[{label:"Overview",href:"#overview",active:!0},{label:"Installation",href:"#installation"},{label:"Usage",href:"#usage"},{label:"API Reference",href:"#api-reference"},{label:"Examples",href:"#examples"}]}},l={args:{items:[{label:"Overview",href:"#overview"},{label:"Installation",href:"#installation"},{label:"Usage",href:"#usage",active:!0},{label:"API Reference",href:"#api-reference"},{label:"Examples",href:"#examples"}]}},t={render:()=>e.jsxs("div",{style:{display:"flex",gap:32,padding:24},children:[e.jsxs("div",{style:{flex:1,color:"var(--color-text-neutral-strong)"},children:[e.jsx("h2",{id:"overview",style:{marginBottom:120},children:"Overview"}),e.jsx("h2",{id:"installation",style:{marginBottom:120},children:"Installation"}),e.jsx("h2",{id:"usage",style:{marginBottom:120},children:"Usage"}),e.jsx("h2",{id:"api-reference",style:{marginBottom:120},children:"API Reference"}),e.jsx("h2",{id:"examples",style:{marginBottom:120},children:"Examples"})]}),e.jsx(s,{items:[{label:"Overview",href:"#overview",active:!0},{label:"Installation",href:"#installation"},{label:"Usage",href:"#usage"},{label:"API Reference",href:"#api-reference"},{label:"Examples",href:"#examples"}]})]})};var i,o,c;r.parameters={...r.parameters,docs:{...(i=r.parameters)==null?void 0:i.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Overview",
      href: "#overview",
      active: true
    }, {
      label: "Installation",
      href: "#installation"
    }, {
      label: "Usage",
      href: "#usage"
    }, {
      label: "API Reference",
      href: "#api-reference"
    }, {
      label: "Examples",
      href: "#examples"
    }]
  }
}`,...(c=(o=r.parameters)==null?void 0:o.docs)==null?void 0:c.source}}};var m,h,d;l.parameters={...l.parameters,docs:{...(m=l.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    items: [{
      label: "Overview",
      href: "#overview"
    }, {
      label: "Installation",
      href: "#installation"
    }, {
      label: "Usage",
      href: "#usage",
      active: true
    }, {
      label: "API Reference",
      href: "#api-reference"
    }, {
      label: "Examples",
      href: "#examples"
    }]
  }
}`,...(d=(h=l.parameters)==null?void 0:h.docs)==null?void 0:d.source}}};var v,p,f;t.parameters={...t.parameters,docs:{...(v=t.parameters)==null?void 0:v.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "flex",
    gap: 32,
    padding: 24
  }}>
      <div style={{
      flex: 1,
      color: "var(--color-text-neutral-strong)"
    }}>
        <h2 id="overview" style={{
        marginBottom: 120
      }}>Overview</h2>
        <h2 id="installation" style={{
        marginBottom: 120
      }}>Installation</h2>
        <h2 id="usage" style={{
        marginBottom: 120
      }}>Usage</h2>
        <h2 id="api-reference" style={{
        marginBottom: 120
      }}>API Reference</h2>
        <h2 id="examples" style={{
        marginBottom: 120
      }}>Examples</h2>
      </div>
      <AnchorMenu items={[{
      label: "Overview",
      href: "#overview",
      active: true
    }, {
      label: "Installation",
      href: "#installation"
    }, {
      label: "Usage",
      href: "#usage"
    }, {
      label: "API Reference",
      href: "#api-reference"
    }, {
      label: "Examples",
      href: "#examples"
    }]} />
    </div>
}`,...(f=(p=t.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};const P=["FiveSections","MiddleActive","WithPageContent"];export{r as FiveSections,l as MiddleActive,t as WithPageContent,P as __namedExportsOrder,O as default};
