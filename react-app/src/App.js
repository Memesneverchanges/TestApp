import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React from 'react';
import Mtable from './apps/mtable/Mtable'
import Alert from './Alertmes';
export const DataContext = React.createContext()
function App() {
  return (
    //Необходимо реализовать передачу информации в Alert через контекст об ошибках из Mtable
    //разбить файлы на директории
    //объеденить в одну директорию API и фронт
    //URL API указан в states.json
    <DataContext.Provider
    
    >
    <div className='wrapper'>
      <Alert/>
      <h1>Test Application</h1>
      <hr />
      <Mtable />
    </div>
     </DataContext.Provider>
  );
}

export default App;