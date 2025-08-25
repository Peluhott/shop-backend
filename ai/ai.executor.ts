import * as productQueries from '../Product/product.repository'
import * as orderQueries from '../Order/order.repository'
import * as userQueries from '../User/user.repository'



export async function executeFunction(functionTool: string, statuses: string){
    try {
        switch(functionTool) {
        case 'get_orders': {
            if(statuses === 'filled'){
                return orderQueries.getFilledOrders()
            } 
            else if( statuses === 'unfilled'){
                return orderQueries.getUnfilledOrders()
            }

            else {
                return orderQueries.getAllOrders()
            }
        }

        case 'get_products': {
            if(statuses === 'top'){
                return productQueries.getTopSellingProducts(5)
            }   
            else {
                return productQueries.getAllProducts()
            }

        }

        case 'get_users': {

            return userQueries.getAllUsers()
        }
    }
    } catch (error) {
        console.log("error executing function")
    }
}