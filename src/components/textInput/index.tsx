
type TextInputProps = {
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const TextInput = ({ name, placeholder, onChange }: TextInputProps) => (
  <input 
    type='text' 
    name={name} 
    onChange={onChange} 
    placeholder={placeholder}
    className='bg-zinc-100 border-2 text-zinc-800 border-sky-500 rounded-md px-4 py-2 text-sm w-[500px]'
  />
)

export default TextInput
