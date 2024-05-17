
export async function getSystemTime(req, res) {
  try {
    res.status(200).json({ message: 'Локальное время успешно получено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}