import{j as e}from"./jsx-runtime-D_zvdyIk.js";const M="_root_4qxpj_1",q="_hasMasthead_4qxpj_11",N="_hasSidebar_4qxpj_17",C="_masthead_4qxpj_29",D="_sidebar_4qxpj_40",O="_content_4qxpj_48",s={root:M,hasMasthead:q,hasSidebar:N,masthead:C,sidebar:D,content:O};function f({masthead:r,sidebar:i,children:R}){return e.jsxs("div",{className:[s.root,r?s.hasMasthead:"",i?s.hasSidebar:""].filter(Boolean).join(" "),children:[r&&e.jsx("header",{className:s.masthead,children:r}),i&&e.jsx("aside",{className:s.sidebar,children:i}),e.jsx("main",{className:s.content,children:R})]})}f.__docgenInfo={description:"",methods:[],displayName:"PageLayout",props:{masthead:{required:!1,tsType:{name:"ReactNode"},description:""},sidebar:{required:!1,tsType:{name:"ReactNode"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""}}};const L={title:"Synapse/PageLayout",component:f};function _(){return e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:16,width:"100%"},children:[e.jsx("strong",{style:{fontSize:16,color:"#252525"},children:"Synapse"}),e.jsxs("nav",{style:{display:"flex",gap:16,marginLeft:"auto",fontSize:14,color:"#4d4d4d"},children:[e.jsx("a",{href:"#",style:{color:"inherit",textDecoration:"none"},children:"Home"}),e.jsx("a",{href:"#",style:{color:"inherit",textDecoration:"none"},children:"Reports"}),e.jsx("a",{href:"#",style:{color:"inherit",textDecoration:"none"},children:"Settings"})]})]})}function v(){return e.jsx("nav",{style:{display:"flex",flexDirection:"column",gap:4},children:["Dashboard","Analytics","Users","Notifications","Settings"].map(r=>e.jsx("a",{href:"#",style:{display:"block",padding:"8px 12px",borderRadius:4,fontSize:14,color:"#4d4d4d",textDecoration:"none"},children:r},r))})}function d(){return e.jsxs("div",{children:[e.jsx("h2",{style:{margin:"0 0 8px",fontSize:20,color:"#252525"},children:"Dashboard"}),e.jsx("p",{style:{margin:0,fontSize:14,color:"#4d4d4d",lineHeight:1.5},children:"Welcome to your dashboard. Here you can view an overview of system metrics, recent activity, and quick actions. Use the sidebar to navigate to other sections."})]})}const a={args:{masthead:e.jsx(_,{}),sidebar:e.jsx(v,{}),children:e.jsx(d,{})},decorators:[r=>e.jsx("div",{style:{height:480,border:"1px solid #e0e0e0",borderRadius:4},children:e.jsx(r,{})})]},t={args:{masthead:e.jsx(_,{}),children:e.jsx(d,{})},decorators:[r=>e.jsx("div",{style:{height:320,border:"1px solid #e0e0e0",borderRadius:4},children:e.jsx(r,{})})]},n={args:{sidebar:e.jsx(v,{}),children:e.jsx(d,{})},decorators:[r=>e.jsx("div",{style:{height:320,border:"1px solid #e0e0e0",borderRadius:4},children:e.jsx(r,{})})]},o={args:{children:e.jsx(d,{})}};var c,l,h;a.parameters={...a.parameters,docs:{...(c=a.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    masthead: <SampleMasthead />,
    sidebar: <SampleSidebar />,
    children: <SampleContent />
  },
  decorators: [Story => <div style={{
    height: 480,
    border: "1px solid #e0e0e0",
    borderRadius: 4
  }}>
        <Story />
      </div>]
}`,...(h=(l=a.parameters)==null?void 0:l.docs)==null?void 0:h.source}}};var p,m,x;t.parameters={...t.parameters,docs:{...(p=t.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    masthead: <SampleMasthead />,
    children: <SampleContent />
  },
  decorators: [Story => <div style={{
    height: 320,
    border: "1px solid #e0e0e0",
    borderRadius: 4
  }}>
        <Story />
      </div>]
}`,...(x=(m=t.parameters)==null?void 0:m.docs)==null?void 0:x.source}}};var y,u,S;n.parameters={...n.parameters,docs:{...(y=n.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    sidebar: <SampleSidebar />,
    children: <SampleContent />
  },
  decorators: [Story => <div style={{
    height: 320,
    border: "1px solid #e0e0e0",
    borderRadius: 4
  }}>
        <Story />
      </div>]
}`,...(S=(u=n.parameters)==null?void 0:u.docs)==null?void 0:S.source}}};var j,b,g;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    children: <SampleContent />
  }
}`,...(g=(b=o.parameters)==null?void 0:b.docs)==null?void 0:g.source}}};const w=["WithMastheadAndSidebar","MastheadOnly","SidebarOnly","ContentOnly"];export{o as ContentOnly,t as MastheadOnly,n as SidebarOnly,a as WithMastheadAndSidebar,w as __namedExportsOrder,L as default};
