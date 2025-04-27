import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search"/>
        <input 
          type="text"
          placeholder="From classics to new hits — find them all here."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          />
      </div>
    </div>
  )
}

export default Search
