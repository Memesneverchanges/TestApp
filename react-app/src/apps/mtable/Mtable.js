import React, { useCallback,useReducer,useState} from 'react';
import DataGrid, { Column, Editing, Lookup} from 'devextreme-react/data-grid';
import { LoadPanel } from 'devextreme-react/load-panel';
import reducer from './reducer.js';
import { saveChange, loadOrders, setChanges, setEditRowKey } from './actions.js';
import { SelectBox } from 'devextreme-react';
import states from './states.json';

const loadPanelPosition = { of: '#gridContainer' };
// в actions.js добавить обработку ввода пользователя с целью ограничения ввода
function Mtable() {
  const tnames = states.tnames
  const [state, dispatch] = useReducer(reducer, states.reducer);
  const [blockid,setBlockOnId]=useState(false)
  const onEditCanceled = () => {
    setBlockOnId(false)
    };
  const onInitNewRow = () => {
  setBlockOnId(true)
  };
  const chooseTable = useCallback((e) => {
    loadOrders(dispatch, e.value);
  }, []);
  const onSaving = useCallback((e) => {
    e.cancel = true;
    e.promise = saveChange(dispatch, e.changes[0]);
  }, []);

  const onChangesChange = useCallback((changes) => {
    setChanges(dispatch, changes);
  }, []);

  const onEditRowKeyChange = useCallback((editRowKey) => {
    setEditRowKey(dispatch, editRowKey);
  }, []);
  console.log("state in m:", state)
  console.log('RENDER')
  return (
    <React.Fragment>
      <SelectBox items={tnames}
        width={250}
        onValueChanged={chooseTable}
       disabled={state.isLoading}
      />
      <LoadPanel
        position={loadPanelPosition}
        visible={state.isLoading}
      />
      <DataGrid
        id="gridContainer"
        keyExpr="ID"
        dataSource={state.data}
        showBorders={true}
        defaultVisible={true}
        columnAutoWidth={true}
        onSaving={onSaving}
        onInitNewRow={onInitNewRow}
        onEditCanceled={onEditCanceled}
        visible={state.currentdb.Eq_model || state.currentdb.parameter || state.currentdb.process || state.currentdb.target_type || state.currentdb.target_trans}>
        <Editing
          mode="row"
          useIcons={true}
          allowAdding
          allowDeleting
          allowUpdating
          changes={state.changes}
          onChangesChange={onChangesChange}
          editRowKey={state.editRowKey}
          onEditRowKeyChange={onEditRowKeyChange}
        />
        <Column type="buttons" width={110} caption="Управление" 
        visible={state.currentdb.Eq_model || state.currentdb.parameter || state.currentdb.process || state.currentdb.target_type || state.currentdb.target_trans} 
        />
        <Column dataField="ID" caption="Номер" 
        visible={state.currentdb.Eq_model || state.currentdb.parameter || state.currentdb.process || state.currentdb.target_type || state.currentdb.target_trans} 
        allowEditing={blockid}
        
        />
        <Column dataField="Name" caption="Имя" 
        visible={state.currentdb.Eq_model || state.currentdb.parameter || state.currentdb.process || state.currentdb.target_type} 
        />
        <Column dataField="Model_type" caption="Тип модели" 
        visible={state.currentdb.Eq_model}
         />
        <Column dataField="Active" caption="Активен" 
        visible={state.currentdb.Eq_model || state.currentdb.parameter || state.currentdb.process || state.currentdb.target_type} />
        <Column dataField="Sname" caption="Короткое имя" visible={state.currentdb.Eq_model} />
        <Column dataField="Unit" caption="Ед.измерения" visible={state.currentdb.parameter} />
        <Column dataField="STATUS_CODE" caption="Статус кода" visible={state.currentdb.parameter} />
        <Column dataField="SUB_STATUS_CODE" caption="Подстатус кода" visible={state.currentdb.parameter} />
        <Column dataField="Descr" caption="Описание" visible={state.currentdb.target_type} />
        <Column dataField="ID_Loader_model" caption="Загрузчик" visible={state.currentdb.target_trans}>
          <Lookup dataSource={state.lookupdata.Eq_model}
            displayExpr="Name"
            valueExpr="ID" />
        </Column>
        <Column dataField="ID_Hauler_model" caption="Самосвал" visible={state.currentdb.target_trans}>
          <Lookup
            dataSource={state.lookupdata.Eq_model}
            displayExpr="Name" valueExpr="ID"
          />
        </Column>
        <Column dataField="ID_Drill_model" caption="Буровой станок" visible={state.currentdb.target_trans}>
          <Lookup
            dataSource={state.lookupdata.Eq_model}
            displayExpr="Name" valueExpr="ID"
          />
        </Column>
        <Column dataField="ID_Process" caption="Процесс" visible={state.currentdb.target_trans}>
          <Lookup
            dataSource={state.lookupdata.process}
            displayExpr="Name" valueExpr="ID"
          />
        </Column>
        <Column dataField="ID_Parameter" caption="Параметр" visible={state.currentdb.target_trans}>
          <Lookup
            dataSource={state.lookupdata.parameter}
            displayExpr="Name" valueExpr="ID"
          />
        </Column>
        <Column dataField="ID_Target_type" caption="Тип" visible={state.currentdb.target_trans} >
        <Lookup
            dataSource={state.lookupdata.target_type}
            displayExpr="Name" valueExpr="ID"
          />
        </Column>
        <Column dataField="Target" caption="Цель" visible={state.currentdb.target_trans} />
      </DataGrid>
    </React.Fragment>
  );
}
export default Mtable;
