import React,{useContext} from 'react';
import { DataContext } from './App';
// выполнить обработку сообщений об ошибках и выводить их пользователю
function Alert(){
    const error=useContext(DataContext)
if(!error){
    return null
}
    return(
    <div>Произошла ошибка: {error}</div>
)
}
export default Alert