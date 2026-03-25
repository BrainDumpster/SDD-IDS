import{j as a}from"./jsx-runtime-D_zvdyIk.js";import{r as l}from"./index-JhL3uwfD.js";const M="_wrapper_13avo_1",$="_table_13avo_7",B="_th_13avo_14",E="_td_13avo_24",L="_tr_13avo_30",G="_sortButton_13avo_34",T="_sortIcon_13avo_54",c={wrapper:M,table:$,th:B,td:E,tr:L,sortButton:G,sortIcon:T};function D({columns:n,data:r,onSort:i}){const[s,A]=l.useState(null),[o,N]=l.useState(null),C=l.useCallback(e=>{let t;s!==e?t="asc":o==="asc"?t="desc":t=null,A(t?e:null),N(t),i==null||i(e,t)},[s,o,i]),R=l.useMemo(()=>!s||!o?r:[...r].sort((e,t)=>{const d=String(e[s]??""),I=String(t[s]??""),h=d.localeCompare(I,void 0,{numeric:!0});return o==="asc"?h:-h}),[r,s,o]);return a.jsx("div",{className:c.wrapper,children:a.jsxs("table",{className:c.table,children:[a.jsx("thead",{children:a.jsx("tr",{children:n.map(e=>{const t=s===e.key;return a.jsx("th",{className:c.th,children:e.sortable?a.jsxs("button",{type:"button",className:c.sortButton,onClick:()=>C(e.key),"aria-sort":t?o==="asc"?"ascending":"descending":"none",children:[a.jsx("span",{children:e.header}),a.jsx(V,{active:t,direction:t?o:null})]}):e.header},e.key)})})}),a.jsx("tbody",{children:R.map((e,t)=>a.jsx("tr",{className:c.tr,children:n.map(d=>a.jsx("td",{className:c.td,children:e[d.key]},d.key))},t))})]})})}function V({active:n,direction:r}){return a.jsxs("svg",{width:"14",height:"14",viewBox:"0 0 14 14",fill:"none",className:c.sortIcon,children:[a.jsx("path",{d:"M7 2L10 6H4L7 2Z",fill:"currentColor",opacity:n&&r==="asc"?1:.3}),a.jsx("path",{d:"M7 12L4 8H10L7 12Z",fill:"currentColor",opacity:n&&r==="desc"?1:.3})]})}D.__docgenInfo={description:"",methods:[],displayName:"DataGrid",props:{columns:{required:!0,tsType:{name:"Array",elements:[{name:"DataGridColumn"}],raw:"DataGridColumn[]"},description:""},data:{required:!0,tsType:{name:"Array",elements:[{name:"Record",elements:[{name:"string"},{name:"ReactReactNode",raw:"React.ReactNode"}],raw:"Record<string, React.ReactNode>"}],raw:"Record<string, React.ReactNode>[]"},description:""},onSort:{required:!1,tsType:{name:"signature",type:"function",raw:"(key: string, direction: SortDirection) => void",signature:{arguments:[{type:{name:"string"},name:"key"},{type:{name:"union",raw:'"asc" | "desc" | null',elements:[{name:"literal",value:'"asc"'},{name:"literal",value:'"desc"'},{name:"null"}]},name:"direction"}],return:{name:"void"}}},description:""}}};const K={title:"Synapse/DataGrid",component:D},j=[{key:"name",header:"Name",sortable:!0},{key:"department",header:"Department",sortable:!0},{key:"tickets",header:"Tickets",sortable:!0},{key:"status",header:"Status",sortable:!1}],w=[{name:"Alice Johnson",department:"Engineering",tickets:"42",status:"Active"},{name:"Bob Smith",department:"Design",tickets:"18",status:"Active"},{name:"Carol White",department:"Product",tickets:"7",status:"Away"},{name:"Dan Brown",department:"Engineering",tickets:"31",status:"Active"},{name:"Eve Davis",department:"QA",tickets:"56",status:"Offline"},{name:"Frank Lee",department:"Design",tickets:"23",status:"Active"},{name:"Grace Kim",department:"Engineering",tickets:"15",status:"Away"},{name:"Hank Miller",department:"Product",tickets:"9",status:"Active"}],m={args:{columns:j,data:w}},u={args:{columns:j.map(n=>({...n,sortable:!0})),data:w}},p={args:{columns:[{key:"id",header:"ID",sortable:!0},{key:"name",header:"Name",sortable:!0},{key:"value",header:"Value",sortable:!0},{key:"date",header:"Date",sortable:!0}],data:Array.from({length:50},(n,r)=>({id:String(r+1),name:`Item ${String.fromCharCode(65+r%26)}${r}`,value:String(Math.floor(Math.random()*1e3)),date:`2025-${String(1+r%12).padStart(2,"0")}-${String(1+r%28).padStart(2,"0")}`}))}};var g,y,S;m.parameters={...m.parameters,docs:{...(g=m.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    columns,
    data
  }
}`,...(S=(y=m.parameters)==null?void 0:y.docs)==null?void 0:S.source}}};var k,b,_;u.parameters={...u.parameters,docs:{...(k=u.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    columns: columns.map(c => ({
      ...c,
      sortable: true
    })),
    data
  }
}`,...(_=(b=u.parameters)==null?void 0:b.docs)==null?void 0:_.source}}};var v,f,x;p.parameters={...p.parameters,docs:{...(v=p.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    columns: [{
      key: "id",
      header: "ID",
      sortable: true
    }, {
      key: "name",
      header: "Name",
      sortable: true
    }, {
      key: "value",
      header: "Value",
      sortable: true
    }, {
      key: "date",
      header: "Date",
      sortable: true
    }],
    data: Array.from({
      length: 50
    }, (_, i) => ({
      id: String(i + 1),
      name: \`Item \${String.fromCharCode(65 + i % 26)}\${i}\`,
      value: String(Math.floor(Math.random() * 1000)),
      date: \`2025-\${String(1 + i % 12).padStart(2, "0")}-\${String(1 + i % 28).padStart(2, "0")}\`
    }))
  }
}`,...(x=(f=p.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};const O=["Sortable","AllSortable","LargeDataSet"];export{u as AllSortable,p as LargeDataSet,m as Sortable,O as __namedExportsOrder,K as default};
