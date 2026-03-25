import{j as e}from"./jsx-runtime-D_zvdyIk.js";const C="_wrapper_vl65o_1",H="_table_vl65o_7",M="_th_vl65o_14",B="_td_vl65o_24",O="_striped_vl65o_31",P="_tr_vl65o_31",Q="_hoverable_vl65o_36",a={wrapper:C,table:H,th:M,td:B,striped:O,tr:P,hoverable:Q};function N({columns:i,data:r,striped:T=!1,hoverable:k=!1}){const E=[a.table,T?a.striped:"",k?a.hoverable:""].filter(Boolean).join(" ");return e.jsx("div",{className:a.wrapper,children:e.jsxs("table",{className:E,children:[e.jsx("thead",{children:e.jsx("tr",{children:i.map(t=>e.jsx("th",{className:a.th,style:t.width?{width:t.width}:void 0,children:t.header},t.key))})}),e.jsx("tbody",{children:r.map((t,q)=>e.jsx("tr",{className:a.tr,children:i.map(p=>e.jsx("td",{className:a.td,children:t[p.key]},p.key))},q))})]})})}N.__docgenInfo={description:"",methods:[],displayName:"Table",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"TableColumn"}],raw:"TableColumn[]"},description:""},data:{required:!0,tsType:{name:"Array",elements:[{name:"Record",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}],raw:"Record<string, React.ReactNode>"}],raw:"Record<string, React.ReactNode>[]"},description:""},striped:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},hoverable:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}}}};const I={title:"Synapse/Table",component:N,argTypes:{striped:{control:"boolean"},hoverable:{control:"boolean"}}},s=[{key:"name",header:"Name",width:"200px"},{key:"role",header:"Role"},{key:"status",header:"Status"},{key:"email",header:"Email"}],m=[{name:"Alice Johnson",role:"Engineer",status:"Active",email:"alice@example.com"},{name:"Bob Smith",role:"Designer",status:"Active",email:"bob@example.com"},{name:"Carol White",role:"PM",status:"Away",email:"carol@example.com"},{name:"Dan Brown",role:"Engineer",status:"Active",email:"dan@example.com"},{name:"Eve Davis",role:"QA",status:"Offline",email:"eve@example.com"}],o={args:{columns:s,data:m}},n={args:{columns:s,data:m,striped:!0}},l={args:{columns:s,data:m,hoverable:!0}},c={args:{columns:s,data:m,striped:!0,hoverable:!0}},V=Array.from({length:20},(i,r)=>({name:`User ${r+1}`,role:["Engineer","Designer","PM","QA"][r%4],status:["Active","Away","Offline"][r%3],email:`user${r+1}@example.com`})),d={args:{columns:s,data:V,striped:!0,hoverable:!0}};var u,h,b;o.parameters={...o.parameters,docs:{...(u=o.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData
  }
}`,...(b=(h=o.parameters)==null?void 0:h.docs)==null?void 0:b.source}}};var v,g,y;n.parameters={...n.parameters,docs:{...(v=n.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    striped: true
  }
}`,...(y=(g=n.parameters)==null?void 0:g.docs)==null?void 0:y.source}}};var _,f,w;l.parameters={...l.parameters,docs:{...(_=l.parameters)==null?void 0:_.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    hoverable: true
  }
}`,...(w=(f=l.parameters)==null?void 0:f.docs)==null?void 0:w.source}}};var x,R,A;c.parameters={...c.parameters,docs:{...(x=c.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    columns,
    data: sampleData,
    striped: true,
    hoverable: true
  }
}`,...(A=(R=c.parameters)==null?void 0:R.docs)==null?void 0:A.source}}};var S,j,D;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    columns,
    data: manyRows,
    striped: true,
    hoverable: true
  }
}`,...(D=(j=d.parameters)==null?void 0:j.docs)==null?void 0:D.source}}};const J=["Default","Striped","Hoverable","StripedHoverable","ManyRows"];export{o as Default,l as Hoverable,d as ManyRows,n as Striped,c as StripedHoverable,J as __namedExportsOrder,I as default};
