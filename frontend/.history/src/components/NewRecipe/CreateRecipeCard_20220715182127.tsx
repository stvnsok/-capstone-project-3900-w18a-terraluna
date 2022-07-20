// import React from 'react';
// import { BsCloudUpload } from 'react-icons/bs';
// import { useForm } from 'react-hook-form'

// type recipeForm = {
//     recipeName:string
//     recipeDescription:string
//     recipeInsruction:string
//     mealType:string
//     dietType:string

// }

// export default function CreateRecipe () {

//     const {
//         recipeForm,
//         formState: { errors },
//         handleSubmit,
//       } = useForm();
//       const onSubmit = (data) => {
//         alert(JSON.stringify(data));
//       };

//     return <React.Fragment>
//         <form>
//             <div>
//                 <label htmlFor='recipeName'> Recipe Name</label>
//                 <input {...recipeForm('recipeName')}/>
//             </div>
//             <div>
//                 <label htmlFor = 'expectedDuration'> Expected Duration</label>
//             </div>
//             <div>
//                 <label htmlFor = 'mealType'> Meal Type</label>
//                 <select
//                     {...recipeForm('mealType')}
//                     options = {[
//                         {label: 'Breakfast', value: 'breakfast'},
//                         {label: 'Lunch', value: 'lunch'},
//                         {label: 'Dinner', value: 'dinner'},
//                         {label: 'Snack', value: 'snack'},
//                     ]}
//                 />
//             </div>
//             <div>
//                 <label htmlFor = 'recipeDescription'> Description</label>
//                 <input {...recipeForm('recipeDescription')}/>
//             </div>
//             <div>
//                 <label htmlFor = 'dietType'> Diet Type</label>
//                 <select
//                     {...recipeForm('dietType')}
//                     options = {[
//                         {label: 'Vegan', value: 'vegan'},
//                         {label: 'Vegetarian', value: 'vegetarian'},
//                         {label: 'Gluten Free', value: 'gluten-free'},
//                         {label: 'Dairy Free', value: 'dairy-free'},
//                         {label: 'Nut Free', value: 'nut-free'},
//                         {label: 'Halal', value: 'Halal'},
//                     ]}
//                 />
//             </div>
//             <div className = "mborder border-dashed border-tl-active-green ">
//                 <BsCloudUpload
//                 />
//             </div>

            
//         </form>
//     </React.Fragment>
// }

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function App() {
  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = (data) =>
    alert(JSON.stringify(data));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input {...register('firstName')} />
      </div>

      <div>
        <label>Last Name</label>
        <input {...register('lastName')} />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input type="email" {...register('email')} />
      </div>

      <input type="submit" />
    </form>
  );
}