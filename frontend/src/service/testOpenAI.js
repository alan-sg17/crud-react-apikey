import openai from './openai';

export const testOpenAIConnection = async () => {
  try {
    console.log('🔍 Probando conexión con OpenAI...');

    // Test simple con un modelo de lista
    const models = await openai.models.list();
    console.log('✅ Conexión exitosa');
    console.log('📋 Modelos disponibles:', models.data.length, 'modelos');

    return true;
  } catch (error) {
    console.error('❌ Error en la conexión:', error.message);
    return false;
  }
};