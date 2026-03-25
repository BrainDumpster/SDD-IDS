import{j as e}from"./jsx-runtime-D_zvdyIk.js";import{r as S}from"./index-JhL3uwfD.js";import{D as z,a as w,b as D,c as W,d as R,e as E,f as g}from"./DialogTrigger-D9514YRZ.js";import{B as j}from"./Button-BI0SS6yn.js";import{T as s}from"./TextInput-CPgAHyLh.js";import"./useRenderElement-RsBRv27X.js";import"./popupStateMapping-CQ_CO6ir.js";import"./floating-ui.utils.dom-Bqtipqz1.js";import"./useTimeout-CmC-sU71.js";import"./useOnMount-B6x4EhYE.js";import"./useId-B8m7M0JZ.js";import"./useIsoLayoutEffect-CnFbsThY.js";import"./createBaseUIEventDetails-ByMWqkvP.js";import"./event-BOP_-AC1.js";import"./detectBrowser-5lYXwz_k.js";import"./element-DmyaY4bW.js";import"./constants-CRqqCNE_.js";import"./useOpenChangeComplete-icb77CBH.js";import"./useValueAsRef-DtqLqviz.js";import"./index-BPftEo5x.js";import"./index-hLVmTiZX.js";import"./useAnimationFrame-D1xspdTI.js";import"./useButton-BjJFDiZL.js";import"./composite-DOn_YXxX.js";import"./InternalBackdrop-Dtv5M0RU.js";import"./owner-CQsS7OFZ.js";import"./visuallyHidden-CbwUG2x5.js";import"./inertValue-DAA6fc98.js";import"./useOpenInteractionType-BbfBqJxI.js";import"./useSyncedFloatingRootContext-D5qHrOP0.js";import"./useTransitionStatus-xXKl72NO.js";import"./useBaseUiId-BLkZpPk-.js";import"./useControlled-BvBqJoZQ.js";import"./LabelableContext-CDu1x6PI.js";import"./useLabelableId-CZJ8eNlp.js";import"./FieldsetRootContext-C7uOxk4V.js";const P="_triggerReset_4ia4h_1",B="_backdrop_4ia4h_6",I="_popup_4ia4h_13",M="_header_4ia4h_36",L="_title_4ia4h_44",F="_close_4ia4h_51",O="_stepper_4ia4h_73",U="_step_4ia4h_73",q="_stepNumber_4ia4h_89",A="_stepLabel_4ia4h_104",G="_active_4ia4h_113",J="_completed_4ia4h_124",H="_body_4ia4h_134",K="_footer_4ia4h_144",Q="_progress_4ia4h_152",V="_actions_4ia4h_157",X="_btnPrimary_4ia4h_163",Y="_btnSecondary_4ia4h_187",t={triggerReset:P,backdrop:B,popup:I,header:M,title:L,close:F,stepper:O,step:U,stepNumber:q,stepLabel:A,active:G,completed:J,body:H,footer:K,progress:Q,actions:V,btnPrimary:X,btnSecondary:Y};function b({steps:o,trigger:T,onFinish:l}){var m,u;const[n,p]=S.useState(0),d=o.length,N=n===0,k=n===d-1,C=()=>p(0);return e.jsxs(z,{onOpenChange:r=>{r||C()},children:[e.jsx(w,{className:t.triggerReset,children:T}),e.jsxs(D,{children:[e.jsx(W,{className:t.backdrop}),e.jsxs(R,{className:t.popup,children:[e.jsxs("div",{className:t.header,children:[e.jsx(E,{className:t.title,children:(m=o[n])==null?void 0:m.title}),e.jsx(g,{className:t.close,"aria-label":"Close",children:e.jsx(Z,{})})]}),e.jsx("div",{className:t.stepper,children:o.map((r,i)=>e.jsxs("div",{className:[t.step,i<n?t.completed:"",i===n?t.active:""].filter(Boolean).join(" "),children:[e.jsx("span",{className:t.stepNumber,children:i+1}),e.jsx("span",{className:t.stepLabel,children:r.title})]},i))}),e.jsx("div",{className:t.body,children:(u=o[n])==null?void 0:u.content}),e.jsxs("div",{className:t.footer,children:[e.jsxs("span",{className:t.progress,children:["Step ",n+1," of ",d]}),e.jsxs("div",{className:t.actions,children:[!N&&e.jsx("button",{type:"button",className:t.btnSecondary,onClick:()=>p(r=>r-1),children:"Previous"}),k?e.jsx(g,{className:t.btnPrimary,onClick:()=>l==null?void 0:l(),children:"Finish"}):e.jsx("button",{type:"button",className:t.btnPrimary,onClick:()=>p(r=>r+1),children:"Next"})]})]})]})]})]})}function Z(){return e.jsx("svg",{width:"16",height:"16",viewBox:"0 0 16 16",fill:"none",children:e.jsx("path",{d:"M12 4L4 12M4 4L12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})})}b.__docgenInfo={description:"",methods:[],displayName:"WizardModal",props:{steps:{required:!0,tsType:{name:"Array",elements:[{name:"WizardStep"}],raw:"WizardStep[]"},description:""},trigger:{required:!0,tsType:{name:"ReactNode"},description:""},onFinish:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}}};const Be={title:"Synapse/WizardModal",component:b},a={args:{trigger:e.jsx(j,{children:"Open Wizard"}),steps:[{title:"Account Info",content:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:16},children:[e.jsx(s,{label:"Full name",placeholder:"Enter your full name"}),e.jsx(s,{label:"Email",type:"email",placeholder:"you@company.com"})]})},{title:"Preferences",content:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsx("p",{style:{margin:0,color:"var(--color-text-neutral)"},children:"Configure your workspace preferences. These can be changed later in settings."}),e.jsx(s,{label:"Team name",placeholder:"My Team"}),e.jsx(s,{label:"Timezone",placeholder:"UTC-5"})]})},{title:"Review",content:e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:12},children:[e.jsxs("p",{style:{margin:0,color:"var(--color-text-neutral)"},children:["Review your information and click ",e.jsx("strong",{children:"Finish"})," to complete setup."]}),e.jsxs("div",{style:{padding:16,background:"var(--color-background-surface-1)",borderRadius:8,fontSize:14},children:[e.jsxs("div",{children:[e.jsx("strong",{children:"Name:"})," John Doe"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Email:"})," john@company.com"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Team:"})," My Team"]}),e.jsxs("div",{children:[e.jsx("strong",{children:"Timezone:"})," UTC-5"]})]})]})}]}},c={args:{trigger:e.jsx(j,{variant:"secondary",children:"Setup Guide"}),steps:[{title:"Welcome",content:e.jsx("p",{style:{margin:0},children:"Welcome to the setup wizard. This will guide you through the initial configuration of your workspace."})},{title:"Connect",content:e.jsx("p",{style:{margin:0},children:"Connect your accounts and data sources to get started."})},{title:"Configure",content:e.jsx("p",{style:{margin:0},children:"Set up your preferences and notification settings."})},{title:"Done",content:e.jsx("p",{style:{margin:0},children:"Everything is ready. Click Finish to start using your workspace."})}]}};var h,y,x;a.parameters={...a.parameters,docs:{...(h=a.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    trigger: <Button>Open Wizard</Button>,
    steps: [{
      title: "Account Info",
      content: <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}>
            <TextInput label="Full name" placeholder="Enter your full name" />
            <TextInput label="Email" type="email" placeholder="you@company.com" />
          </div>
    }, {
      title: "Preferences",
      content: <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
            <p style={{
          margin: 0,
          color: "var(--color-text-neutral)"
        }}>
              Configure your workspace preferences. These can be changed later in settings.
            </p>
            <TextInput label="Team name" placeholder="My Team" />
            <TextInput label="Timezone" placeholder="UTC-5" />
          </div>
    }, {
      title: "Review",
      content: <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 12
      }}>
            <p style={{
          margin: 0,
          color: "var(--color-text-neutral)"
        }}>
              Review your information and click <strong>Finish</strong> to complete setup.
            </p>
            <div style={{
          padding: 16,
          background: "var(--color-background-surface-1)",
          borderRadius: 8,
          fontSize: 14
        }}>
              <div><strong>Name:</strong> John Doe</div>
              <div><strong>Email:</strong> john@company.com</div>
              <div><strong>Team:</strong> My Team</div>
              <div><strong>Timezone:</strong> UTC-5</div>
            </div>
          </div>
    }]
  }
}`,...(x=(y=a.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};var f,_,v;c.parameters={...c.parameters,docs:{...(f=c.parameters)==null?void 0:f.docs,source:{originalSource:`{
  args: {
    trigger: <Button variant="secondary">Setup Guide</Button>,
    steps: [{
      title: "Welcome",
      content: <p style={{
        margin: 0
      }}>
            Welcome to the setup wizard. This will guide you through the initial
            configuration of your workspace.
          </p>
    }, {
      title: "Connect",
      content: <p style={{
        margin: 0
      }}>
            Connect your accounts and data sources to get started.
          </p>
    }, {
      title: "Configure",
      content: <p style={{
        margin: 0
      }}>
            Set up your preferences and notification settings.
          </p>
    }, {
      title: "Done",
      content: <p style={{
        margin: 0
      }}>
            Everything is ready. Click Finish to start using your workspace.
          </p>
    }]
  }
}`,...(v=(_=c.parameters)==null?void 0:_.docs)==null?void 0:v.source}}};const Ie=["ThreeStepWizard","FourStepWizard"];export{c as FourStepWizard,a as ThreeStepWizard,Ie as __namedExportsOrder,Be as default};
