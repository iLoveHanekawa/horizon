type ErrorProps = Readonly<{
    errors?: string[]
}>

export const Errors: React.FC<ErrorProps> = ({ errors }) => {
    if(!errors) return null;
    else return <ul>
        {errors.map(( error, index ) => {
            // can use index as a key since errors are readonly
            return <li className="test-red-800 text-xs text-red-700 font-medium" key={index}>
                { error }
            </li>
        })}
    </ul>
}