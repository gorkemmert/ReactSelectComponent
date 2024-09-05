import CustomSelect from '../components/CustomSelect/CustomSelect';
import { useState } from 'react';
import {
  useQuery,
} from '@tanstack/react-query'

function ExamplePage() {

  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
    console.log('Selected Value:', value);
  };

  const { isPending, error, data } = useQuery({
    queryKey: ['repoData'],
    queryFn: () =>
      fetch('https://jsonplaceholder.typicode.com/users').then((res) =>
        res.json(),
      ),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
   
     
    <CustomSelect options={data} onChange={handleSelectChange} displayValue="username" keyValue="id" sortable placeholder="Select team member" value={selectedOption} />
     
    
  );
}

export default ExamplePage;
