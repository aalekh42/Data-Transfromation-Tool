import React from 'react';

function Filter({ filterItems, categoryItems }) {
    console.log("render filter");
  return (
    <div>
      <h2>Filter</h2>
      <div className="list-checkbox">
        <input
          onChange={(e) => {
            // add to list
            filterItems(e);
          }}
          name="all select"
          value="all select"
          checked={
            categoryItems &&
            categoryItems.filter((elem) => elem?.isChecked !== true).length < 1
          }
          style={{ margin: '20px' }}
          type="checkbox"
        />
        <span>All Select</span>
        <br />
        {categoryItems &&
          categoryItems.map((elem, index) => {
            return (
              <div key={index}>
                <input
                  onChange={(e) => {
                    // add to list
                    filterItems(e);
                  }}
                  name={elem.name}
                  value={elem.name}
                  checked={elem?.isChecked || false}
                  style={{ margin: '20px' }}
                  type="checkbox"
                />
                <span>{elem.name}</span>
                <br />
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Filter;
export const MemoizedFilter=React.memo(Filter);
