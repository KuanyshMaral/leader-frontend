import Layout from '../../components/Layout';

export default function PartnerBankPage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Мой Банк</h1>
      <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-2xl">
          <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-3xl font-bold text-green-600">
                  С
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-gray-800">Сбербанк (ПАО)</h2>
                  <p className="text-gray-500">Генеральная лицензия ЦБ РФ №1481</p>
              </div>
          </div>
          
          <div className="space-y-4">
              <div className="flex justify-between border-b py-2">
                  <span className="text-gray-500">Статус партнера</span>
                  <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">Активен</span>
              </div>
              <div className="flex justify-between border-b py-2">
                  <span className="text-gray-500">API Интеграция</span>
                  <span className="text-gray-800">Подключена (v2.0)</span>
              </div>
              <div className="flex justify-between border-b py-2">
                  <span className="text-gray-500">Текущий тариф</span>
                  <span className="text-gray-800">Premium</span>
              </div>
          </div>
      </div>
    </Layout>
  );
}