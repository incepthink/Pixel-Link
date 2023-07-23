import React from 'react'
import { flattenObj, returnShortAddress } from '../../utils/utils'

const TableComponent = ({ keys, object }) => {

  return (
    <table className='w-full text-sm text-left text-custom-blue  mt-10 '>
      <thead className='text-xs uppercase bg-custom-blue/20 rounded-lg text-center'>
        <tr key={"header"}>
          {Object.keys(keys).map((key, i) => (
            <th className='px-6 py-3' key={i}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {object.map((item) => {
          const flatObject = flattenObj(item);
          console.log(flatObject);
          return <tr scope="row" className='bg-custom-blue/30  hover:bg-custom-blue/40 text-white text-center' key={item.id}>
            {Object.values(keys).map((key, i) => {
              if (key.type === "param") {
                let value = flatObject[key.value];
                if (key.value === "contract_address" || key.value === "wallet_address") {
                  value = returnShortAddress(value);
                }
                return <td className='px-6 py-4' key={i}>{value}</td>
              } else if (key.type === "button") {
                return (
                  <td className='px-6 py-4' key={i}>
                    <button
                      className='text-center px-2 py-2 border-1 border-custom-blue/60 hover:bg-custom-blue rounded-md shadow-sm'
                      onClick={() => { key.onClick(item.id) }}
                    >
                      {key.value}
                    </button>
                  </td>
                )
              }
            })}
          </tr>
        })}
      </tbody>
    </table>
  )
}

export default TableComponent