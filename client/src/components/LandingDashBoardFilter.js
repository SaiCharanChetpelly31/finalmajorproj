import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import React, { useState } from "react";

function LandingDashBoardFilter({
    filterOptions = {
        keyword: "",
        category: "",
        college:"",
        dateRange: "",
        price: [10, 3000],
    },
    setFilterOptions,
    handleFilterClear,
    setAdminId
}) {
    // function to handle filter values
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case "keyword":
                setFilterOptions({ ...filterOptions, keyword: value });
                break;
            case "category":
                setFilterOptions({ ...filterOptions, category: value });
                break;
            case "college":
                setFilterOptions({ ...filterOptions, college: value });
                break;
            case "dateRange":
                setFilterOptions({ ...filterOptions, dateRange: value });
                break;
            default:
                break;
        }
    };

    // function to handle price change in filters
    const handlePriceChange = (value) => {
        setFilterOptions({ ...filterOptions, price: [...value] });
    };
    console.log(filterOptions)
    return (
        // Add filter options to the DOM element
        <div>
            <h2 className="text-lg font-medium mb-2">Filter Options</h2>
            <form className="flex flex-col gap-y-3">
                {/* Input to search through keyword */}
                <div className="mb-2">
                    <label htmlFor="keyword" className="font-medium block mb-1">
                        Keyword
                    </label>
                    <input
                        type="text"
                        id="keyword"
                        name="keyword"
                        value={filterOptions.keyword}
                        onChange={handleInputChange}
                        className="filterInput"
                        placeholder="Search by keyword..."
                    />
                </div>
                {/* Selection menu to choose a category */}
                <div className="mb-2">
                    <label
                        htmlFor="category"
                        className="font-medium block mb-1"
                    >
                        Category
                    </label>
                    <select
                        id="category"
                        name="category"
                        value={filterOptions.category}
                        onChange={handleInputChange}
                        className="filterInput"
                    >
                        <option value="">Select a category...</option>
                        <option value="Technical">Technical</option>
                        <option value="Non-Technical">Non-Technical</option>
                        <option value="Cultural">Cultural</option>
                    </select>
                </div>
                <div className="mb-2">
                    <label
                        htmlFor="college"
                        className="font-medium block mb-1"
                    >
                        Select College
                    </label>
                    <select
                        id="college"
                        name="college"
                        value={filterOptions.college}
                        onChange={handleInputChange}
                        className="filterInput"
                    >
                        <option value="">Select a College...</option>
                        <option value="MVSR">MVSR</option>
                        <option value="SPHN">SPHN</option>
                        <option value="CVR">CVR</option>
                    </select>
                </div>
                {/* Input field to filter through a date range */}
                <div className="mb-2">
                    <label
                        htmlFor="dateRange"
                        className="font-medium block mb-1"
                    >
                        Date Range
                    </label>
                    <input
                        type="date"
                        id="dateRange"
                        name="dateRange"
                        value={filterOptions.dateRange}
                        onChange={handleInputChange}
                        className="filterInput"
                    />
                </div>
                
            </form>
            <button
                onClick={handleFilterClear}
                className="w-full mt-2 text-white py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-800"
            >
                Clear Filters
            </button>
        </div>
    );
}

export default LandingDashBoardFilter;
