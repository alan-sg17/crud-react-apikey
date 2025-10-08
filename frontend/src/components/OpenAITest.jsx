import { useState } from 'react';
import { testOpenAIConnection } from '../services/testOpenAI';

function OpenAITest() {
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTest = async () => {
    setIsTesting(true);
    setError(null);
    setResult(null);

    try {
      const success = await testOpenAIConnection();
      setResult(success ? '✅ Conexión exitosa!' : '❌ Conexión fallida');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsTesting(false);
    }
  };
// sos
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Prueba de conexión OpenAI</h3>
      <button 
        onClick={handleTest} 
        disabled={isTesting}
        style={{ padding: '10px 20px', margin: '10px 0' }}
      >
        {isTesting ? 'Probando...' : 'Probar conexión'}
      </button>

      {result && (
        <div style={{ 
          color: result.includes('✅') ? 'green' : 'red',
          margin: '10px 0',
          fontWeight: 'bold'
        }}>
          {result}
        </div>
      )}

      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}

export default OpenAITest;