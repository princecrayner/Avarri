// frontend/src/components/UploadModal.jsx
import React from "react";

export default function UploadModal({ onClose, onUploaded }) {
  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center'
    }}>
      <div style={{ background:'#fff', padding:20, borderRadius:12, width:'90%', maxWidth:420 }}>
        <h3 style={{ margin:0, marginBottom:12 }}>Upload (use top Upload button)</h3>
        <p style={{ marginTop:0, color:'#666' }}>This modal is optional. Use the top Upload button to pick files directly.</p>
        <button onClick={onClose} style={{ marginTop:12, padding:8 }}>Close</button>
      </div>
    </div>
  );
}
