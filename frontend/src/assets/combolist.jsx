import { useState } from 'react';

const people = [
  'Lolaleads',
  'Bizaglo',
  'Smoth marketing',
  'Intera mail',
  'Boring offers',
];

function MyCombobox() {
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filtered people based on query
  const filteredPeople = query === '' ? people : people.filter((person) =>
    person.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (person) => {
    setSelectedPerson(person);
    setQuery(''); // Clear query when selecting
    setIsOpen(false); // Close the dropdown
  };

  return (
    <div className="relative w-small max-w-md mx-auto">
      {/* Input Field */}
      <input
        type="text"
        className="w-full border-2 border-gray-300 rounded-xl p-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
        value={selectedPerson || query} // Display selected or typed value
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)} // Open dropdown on focus
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Close dropdown after blur with delay
        placeholder="Select an Affiliate..."
      />

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute mt-2 w-full bg-white border-2 border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto z-10">
          {filteredPeople.length === 0 ? (
            <div className="cursor-default select-none p-3 text-gray-400">No results found.</div>
          ) : (
            filteredPeople.map((person) => (
              <div
                key={person}
                onClick={() => handleSelect(person)}
                className="cursor-pointer select-none p-3 text-gray-900 hover:bg-blue-500 hover:text-white transition duration-200 ease-in-out"
              >
                {person}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MyCombobox;
