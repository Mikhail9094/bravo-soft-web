import { useContext, useEffect, useState } from "react";
import styles from "./InfoAboutOrdersPage.module.scss";
import { IOrder } from "./types";
import { getApplications } from "../../api/requests";
import Loading from "../../Components/Loading";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/authContext";

function InfoAboutOrdersPage() {
  const [orders, setOrders] = useState<[string, number][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { changeAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const getOrders = async () => {
      try {
        setIsLoading(true);
        const applications = await getApplications();
        const orders = transformedApplications(applications);
        setOrders(orders);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        if (error.response) {
          if (error.response.status === 401) {
            navigate("/login");
            changeAuthStatus(false);
          } else {
            setError("Ошибка: " + error.message);
          }
        } else {
          setError("Ошибка: " + error.message);
        }
      }
    };
    getOrders();
  }, [navigate, changeAuthStatus]);

  function transformedApplications(data: IOrder[]) {
    const transformedArray = data.reduce((acc: { [key: string]: number }, order) => {
      const document = order.document;
      if (!acc[document]) {
        acc[document] = 0;
      }
      acc[document]++;
      return acc;
    }, {});
    return Object.entries(transformedArray).sort((a, b) => b[1] - a[1]);
  }

  return (
    <>
      {!isLoading ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Наименование документа</th>
              <th>Количество заявок</th>
            </tr>
            {error && <tr style={{ color: "red" }}>{error}</tr>}
          </thead>
          <tbody className={styles.tbody}>
            {orders.map((item) => (
              <tr key={item[0]}>
                <td>{item[0]}</td>
                <td className={styles.count}>{item[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default InfoAboutOrdersPage;
