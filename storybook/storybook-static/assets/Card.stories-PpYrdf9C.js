import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{B as p}from"./Button-BI0SS6yn.js";import"./index-JhL3uwfD.js";import"./useButton-BjJFDiZL.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useRenderElement-RsBRv27X.js";import"./useIsoLayoutEffect-CnFbsThY.js";const F="_card_g5gvp_1",R="_elevated_g5gvp_9",D="_outlined_g5gvp_18",G="_header_g5gvp_22",J="_title_g5gvp_26",L="_body_g5gvp_34",V="_footer_g5gvp_41",t={card:F,elevated:R,outlined:D,header:G,title:J,body:L,footer:V};function r({title:l,children:O,footer:c,elevated:z=!1,outlined:q=!1}){const k=[t.card,z?t.elevated:"",q?t.outlined:""].filter(Boolean).join(" ");return e.jsxs("div",{className:k,children:[l&&e.jsx("div",{className:t.header,children:e.jsx("h3",{className:t.title,children:l})}),e.jsx("div",{className:t.body,children:O}),c&&e.jsx("div",{className:t.footer,children:c})]})}r.__docgenInfo={description:"",methods:[],displayName:"Card",props:{title:{required:!1,tsType:{name:"string"},description:""},children:{required:!0,tsType:{name:"ReactNode"},description:""},footer:{required:!1,tsType:{name:"ReactNode"},description:""},elevated:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},outlined:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const Q={title:"Synapse/Card",component:r,argTypes:{elevated:{control:"boolean"},outlined:{control:"boolean"}}},n={args:{title:"Card Title",children:e.jsx("p",{style:{margin:0},children:"This is a basic card with a title and body content. Cards are used to group related information into a single container."})}},a={args:{title:"Elevated Card",elevated:!0,children:e.jsx("p",{style:{margin:0},children:"This card uses shadow tokens to create a raised appearance."})}},s={args:{title:"Outlined Card",outlined:!0,children:e.jsx("p",{style:{margin:0},children:"This card uses a border to define its boundary."})}},o={args:{title:"Card with Footer",outlined:!0,children:e.jsx("p",{style:{margin:0},children:"This card includes a footer area for actions or supplementary info."}),footer:e.jsxs("div",{style:{display:"flex",gap:8,justifyContent:"flex-end"},children:[e.jsx(p,{variant:"secondary",size:"sm",children:"Cancel"}),e.jsx(p,{size:"sm",children:"Save"})]})}},d={args:{outlined:!0,children:e.jsx("p",{style:{margin:0},children:"Cards work without a title too. Just body content."})}},i={render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16},children:[e.jsx(r,{title:"Default",children:e.jsx("p",{style:{margin:0},children:"No elevation or border."})}),e.jsx(r,{title:"Elevated",elevated:!0,children:e.jsx("p",{style:{margin:0},children:"Shadow for depth."})}),e.jsx(r,{title:"Outlined",outlined:!0,children:e.jsx("p",{style:{margin:0},children:"Border for structure."})}),e.jsx(r,{title:"Both",elevated:!0,outlined:!0,footer:e.jsx("span",{style:{fontSize:12,color:"#757575"},children:"Last updated: today"}),children:e.jsx("p",{style:{margin:0},children:"Elevated and outlined with footer."})})]})};var u,m,h;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    title: "Card Title",
    children: <p style={{
      margin: 0
    }}>
        This is a basic card with a title and body content. Cards are used to
        group related information into a single container.
      </p>
  }
}`,...(h=(m=n.parameters)==null?void 0:m.docs)==null?void 0:h.source}}};var g,y,f;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    title: "Elevated Card",
    elevated: true,
    children: <p style={{
      margin: 0
    }}>
        This card uses shadow tokens to create a raised appearance.
      </p>
  }
}`,...(f=(y=a.parameters)==null?void 0:y.docs)==null?void 0:f.source}}};var v,x,C;s.parameters={...s.parameters,docs:{...(v=s.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    title: "Outlined Card",
    outlined: true,
    children: <p style={{
      margin: 0
    }}>
        This card uses a border to define its boundary.
      </p>
  }
}`,...(C=(x=s.parameters)==null?void 0:x.docs)==null?void 0:C.source}}};var j,_,b;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    title: "Card with Footer",
    outlined: true,
    children: <p style={{
      margin: 0
    }}>
        This card includes a footer area for actions or supplementary info.
      </p>,
    footer: <div style={{
      display: "flex",
      gap: 8,
      justifyContent: "flex-end"
    }}>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button size="sm">Save</Button>
      </div>
  }
}`,...(b=(_=o.parameters)==null?void 0:_.docs)==null?void 0:b.source}}};var T,w,B;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    outlined: true,
    children: <p style={{
      margin: 0
    }}>
        Cards work without a title too. Just body content.
      </p>
  }
}`,...(B=(w=d.parameters)==null?void 0:w.docs)==null?void 0:B.source}}};var N,S,E;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <div style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16
  }}>
      <Card title="Default">
        <p style={{
        margin: 0
      }}>No elevation or border.</p>
      </Card>
      <Card title="Elevated" elevated>
        <p style={{
        margin: 0
      }}>Shadow for depth.</p>
      </Card>
      <Card title="Outlined" outlined>
        <p style={{
        margin: 0
      }}>Border for structure.</p>
      </Card>
      <Card title="Both" elevated outlined footer={<span style={{
      fontSize: 12,
      color: "#757575"
    }}>Last updated: today</span>}>
        <p style={{
        margin: 0
      }}>Elevated and outlined with footer.</p>
      </Card>
    </div>
}`,...(E=(S=i.parameters)==null?void 0:S.docs)==null?void 0:E.source}}};const U=["Basic","Elevated","Outlined","WithFooter","NoTitle","Gallery"];export{n as Basic,a as Elevated,i as Gallery,d as NoTitle,s as Outlined,o as WithFooter,U as __namedExportsOrder,Q as default};
