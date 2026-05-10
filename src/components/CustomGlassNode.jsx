import { Handle, Position } from 'reactflow';

const CustomGlassNode = ({ data }) => {
  return (
    <div style={{
      padding: '15px 25px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)', // Frosted glass base
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 0 15px rgba(0, 255, 255, 0.3)', // Neon glow
      color: '#fff',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      minWidth: '200px'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#0ff' }} />
      
      <div style={{ fontWeight: 'bold', fontSize: data.isRoot ? '18px' : '16px' }}>
        {data.label}
      </div>
      
      {data.action && (
        <div style={{ fontSize: '12px', marginTop: '8px', color: 'rgba(255, 255, 255, 0.7)' }}>
          {data.action}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: '#0ff' }} />
    </div>
  );
};

export default CustomGlassNode;
