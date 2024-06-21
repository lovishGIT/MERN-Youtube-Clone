// The EXPECTED exports are express function like (req, res, next) or something like that

// while doing an async operations, usually async await syntax returns us promises rather than express functions. 
// even if we return the function. the function is returned in form of a callback after the promise. So, async cant be used here.

// here we can use async await in inner/child function. but we cant do the same in outer/parent function.


export const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(requestHandler(req, res, next))
            .catch((err) => next(err))
    }
}


// export const asyncHandler= (requestHandler)=> { // parent 
//     return async (req, res, next)=> { // child 
//         try {
//             await requestHandler(req, res, next); // this will make sure function in executed and then output of this is another function 
//                                                   // which is (req, res, next) funtion only. and then it goes to parent function and returned directly 
//                                                   // because parent function is not async function.
//         }
//         catch(error) {
//             res.status(error.code || 500)
//             .json({
//                 success: false,
//                 message: error.message,
//             })
//         }
//     }
// }