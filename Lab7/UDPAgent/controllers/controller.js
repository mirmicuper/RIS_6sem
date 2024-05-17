
export async function getTime(req, res) {
  try {
    res.status(200).json({ message: 'Время от координатора успешно получено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}