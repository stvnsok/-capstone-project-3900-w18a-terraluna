// import { useFieldArray, useFormContext } from 'react-hook-form';

// function AddIngredientsForm() {
//     const {control, register} = useFormContext<Ingredient>();
//     const { fields, append, remove } = useFieldArray<Ingredient>({
//         control,
//         name: 'ingredients',
//         defaultValue: [],
//       });
    
//     const addNewIngredient = () => {
//         append({
//             name: '',
//         });
//     };
    
//     const removeIngredient = (Index: number) => () => {
//         remove(Index);
//    };
    
//     return {
//     fields,
//     register,
//     addNewIngredient,
//     removeIngredient,
//     };
// }

// export default AddIngredientsForm;