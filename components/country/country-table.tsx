import { useCountryStore } from "@/lib/state/country-store";
import React from "react";
import PropTypes from "prop-types";
import { z } from "zod";
import { cn } from "@/lib/utils";

export function CountryTable({ headerData, keysToRender, tableData }:TableProps) {
  // Get the selected country and region from the global store.
  const {
    // selectedCountry,
    // setSelectedCountry,
    selectedRegion,
    setSelectedRegion,
  } = useCountryStore();
  // Handle click on a country link.
  // const handleCountryClick = (alpha3Code: string) => {
  //   setSelectedCountry(alpha3Code);
  // };
  return <Table headerData={headerData} keysToRender={keysToRender} tableData={tableData}/>;
}


interface TableProps {
  headerData: string[];
  keysToRender: string[];
  tableData: {
    [key: string]: any;
  }[];
}

function Table({ headerData, keysToRender, tableData }: TableProps) {
  const rows: JSX.Element[] = tableData.map((row) => {
    const cells: JSX.Element[] = keysToRender.map((key, idxKey) =>
      idxKey === 0 ? (
        <th
          key={key}
          scope="row"
          className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
        >
          {row[key]}
        </th>
      ) : (
        <td key={key} className="py-4 px-6">
          {row[key]}
        </td>
      )
    );

    return (
      <tr
        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
        key={row.name}
      >
        {cells}
      </tr>
    );
  });

  const tableClasses = cn(
    "w-full text-sm text-left text-gray-500 dark:text-gray-400"
  );
  const theadClasses = cn(
    "text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400 dark:bg-gray-700"
  );
  const thClasses = cn("py-3 px-6");

  return (
    <div className={cn("overflow-x-auto relative shadow-md sm:rounded-lg")}>
      <table className={tableClasses}>
        <thead className={theadClasses}>
          <tr>
            {headerData.map((header, idxHeader) => (
              <th
                key={`th-${header}-${idxHeader}`}
                className="py-3 px-6"
                scope="col"
              >
                {header}
              </th>
            ))}
            <th scope="col" className={thClasses}>
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>

        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
const tableDataSchema = z.record(z.any());

// tableData: PropTypes.arrayOf(
//   PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     productName: PropTypes.string.isRequired,
//     color: PropTypes.string.isRequired,
//     category: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//   })
// ).isRequired,
// Table.propTypes = {
//   headerData: PropTypes.arrayOf(PropTypes.string).isRequired,
//   keysToRender: PropTypes.arrayOf(PropTypes.string).isRequired,
//   tableData: PropTypes.arrayOf(tableDataSchema).isRequired,
// };

export { Table };

// {/* {tableData.map((row) => ( */}
// {/*   <tr */}
// {/*     key={row.id} */}
// {/*     className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" */}
// {/*   > */}
// {/*     <th */}
// {/*       scope="row" */}
// {/*       className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white" */}
// {/*     > */}
// {/*       {row.productName} */}
// {/*     </th> */}
// {/*     <td className="py-4 px-6">{row.color}</td> */}
// {/*     <td className="py-4 px-6">{row.category}</td> */}
// {/*     <td className="py-4 px-6">{row.price}</td> */}
// {/*     <td className="py-4 px-6 text-right"> */}
// {/*       <a */}
// {/*         href="#" */}
// {/*         className="font-medium text-blue-600 dark:text-blue-500 hover:underline" */}
// {/*       > */}
// {/*         Edit */}
// {/*       </a> */}
// {/*     </td> */}
// {/*   </tr> */}
// {/* ))} */}
