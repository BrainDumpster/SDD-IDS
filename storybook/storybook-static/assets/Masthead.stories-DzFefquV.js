import{j as e}from"./jsx-runtime-D_zvdyIk.js";const S="_masthead_12k2e_1",k="_left_12k2e_12",j="_logo_12k2e_19",I="_nav_12k2e_29",L="_navList_12k2e_34",N="_navItem_12k2e_43",R="_navLink_12k2e_48",z="_navLinkActive_12k2e_74",A="_actions_12k2e_80",n={masthead:S,left:k,logo:j,nav:I,navList:L,navItem:N,navLink:R,navLinkActive:z,actions:A};function v({logo:o,navItems:b=[],actions:i,className:y,..._}){return e.jsxs("header",{className:[n.masthead,y].filter(Boolean).join(" "),..._,children:[e.jsxs("div",{className:n.left,children:[o&&e.jsx("div",{className:n.logo,children:o}),e.jsx("nav",{className:n.nav,"aria-label":"Main navigation",children:e.jsx("ul",{className:n.navList,children:b.map((a,x)=>e.jsx("li",{className:n.navItem,children:e.jsx("a",{href:a.href,className:[n.navLink,a.active?n.navLinkActive:""].filter(Boolean).join(" "),"aria-current":a.active?"page":void 0,children:a.label})},x))})})]}),i&&e.jsx("div",{className:n.actions,children:i})]})}v.__docgenInfo={description:"",methods:[],displayName:"Masthead",props:{logo:{required:!1,tsType:{name:"ReactNode"},description:""},navItems:{required:!1,tsType:{name:"Array",elements:[{name:"NavItem"}],raw:"NavItem[]"},description:"",defaultValue:{value:"[]",computed:!1}},actions:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["ComponentProps"]};const D={title:"Synapse/Masthead",component:v,parameters:{layout:"fullscreen"}},t={args:{logo:e.jsx("span",{style:{fontSize:16,fontWeight:500},children:"Synapse"}),navItems:[{label:"Dashboard",href:"/",active:!0},{label:"Reports",href:"/reports"},{label:"Settings",href:"/settings"}]}},s={args:{logo:e.jsx("span",{style:{fontSize:16,fontWeight:500},children:"Synapse"}),navItems:[{label:"Dashboard",href:"/",active:!0},{label:"Reports",href:"/reports"},{label:"Analytics",href:"/analytics"},{label:"Settings",href:"/settings"}],actions:e.jsxs("div",{style:{display:"flex",gap:8,alignItems:"center"},children:[e.jsx("button",{style:{background:"transparent",border:"1px solid rgba(255,255,255,0.4)",color:"#fff",borderRadius:4,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:14},children:"Help"}),e.jsx("button",{style:{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",borderRadius:4,padding:"4px 12px",cursor:"pointer",fontFamily:"inherit",fontSize:14},children:"Profile"})]})}},r={args:{logo:e.jsx("span",{style:{fontSize:16,fontWeight:500},children:"Synapse Platform"})}};var l,c,d;t.parameters={...t.parameters,docs:{...(l=t.parameters)==null?void 0:l.docs,source:{originalSource:`{
  args: {
    logo: <span style={{
      fontSize: 16,
      fontWeight: 500
    }}>Synapse</span>,
    navItems: [{
      label: "Dashboard",
      href: "/",
      active: true
    }, {
      label: "Reports",
      href: "/reports"
    }, {
      label: "Settings",
      href: "/settings"
    }]
  }
}`,...(d=(c=t.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,f,m;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    logo: <span style={{
      fontSize: 16,
      fontWeight: 500
    }}>Synapse</span>,
    navItems: [{
      label: "Dashboard",
      href: "/",
      active: true
    }, {
      label: "Reports",
      href: "/reports"
    }, {
      label: "Analytics",
      href: "/analytics"
    }, {
      label: "Settings",
      href: "/settings"
    }],
    actions: <div style={{
      display: "flex",
      gap: 8,
      alignItems: "center"
    }}>
        <button style={{
        background: "transparent",
        border: "1px solid rgba(255,255,255,0.4)",
        color: "#fff",
        borderRadius: 4,
        padding: "4px 12px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 14
      }}>
          Help
        </button>
        <button style={{
        background: "rgba(255,255,255,0.15)",
        border: "none",
        color: "#fff",
        borderRadius: 4,
        padding: "4px 12px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 14
      }}>
          Profile
        </button>
      </div>
  }
}`,...(m=(f=s.parameters)==null?void 0:f.docs)==null?void 0:m.source}}};var h,g,u;r.parameters={...r.parameters,docs:{...(h=r.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    logo: <span style={{
      fontSize: 16,
      fontWeight: 500
    }}>Synapse Platform</span>
  }
}`,...(u=(g=r.parameters)==null?void 0:g.docs)==null?void 0:u.source}}};const P=["Default","WithActions","LogoOnly"];export{t as Default,r as LogoOnly,s as WithActions,P as __namedExportsOrder,D as default};
