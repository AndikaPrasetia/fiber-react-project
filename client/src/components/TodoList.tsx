// Mengimpor komponen Flex, Spinner, Stack, dan Text dari Chakra UI
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";

// Mengimpor komponen TodoItem dari file TodoItem
import TodoItem from "./TodoItem";
// Mengimpor hook useQuery dari @tanstack/react-query
import { useQuery } from "@tanstack/react-query";
// Mengimpor konstanta BASE_URL dari file App
import { BASE_URL } from "../App";

// Mendefinisikan tipe Todo
export type Todo = {
	_id: number; // ID unik untuk setiap todo
	body: string; // Deskripsi dari todo
	completed: boolean; // Status penyelesaian todo
};

// Mendefinisikan fungsi komponen TodoList
const TodoList = () => {
	// Menggunakan hook useQuery untuk mengambil data todos dan status loading
	const { data: todos, isLoading } = useQuery<Todo[]>({
		queryKey: ["todos"], // Kunci query
		queryFn: async () => {
			try {
				// Mengirim permintaan GET ke server untuk mengambil todos
				const res = await fetch(BASE_URL + "/todos");
				// Mengurai respons JSON
				const data = await res.json();

				// Memeriksa apakah respons tidak OK
				if (!res.ok) {
					// Melempar error jika respons tidak OK
					throw new Error(data.error || "Something went wrong");
				}
				// Mengembalikan data atau array kosong
				return data || [];
			} catch (error) {
				// Menampilkan error di konsol jika terjadi kesalahan
				console.log(error);
			}
		},
	});

	// Mengembalikan elemen JSX
	return (
		<>
			{/* Menampilkan teks "Today's Tasks" dengan gaya tertentu */}
			<Text
				fontSize={"4xl"}
				textTransform={"uppercase"}
				fontWeight={"bold"}
				textAlign={"center"}
				my={2}
				bgGradient='linear(to-l, #0b85f8, #00ffff)'
				bgClip='text'
			>
				Today's Tasks
			</Text>
			{/* Menampilkan spinner jika data sedang dimuat */}
			{isLoading && (
				<Flex justifyContent={"center"} my={4}>
					<Spinner size={"xl"} />
				</Flex>
			)}
			{/* Menampilkan pesan jika tidak ada todo */}
			{!isLoading && todos?.length === 0 && (
				<Stack alignItems={"center"} gap='3'>
					<Text fontSize={"xl"} textAlign={"center"} color={"gray.500"}>
						All tasks completed! 🤞
					</Text>
					<img src='/go.png' alt='Go logo' width={70} height={70} />
				</Stack>
			)}
			{/* Menampilkan daftar todo */}
			<Stack gap={3}>
				{todos?.map((todo) => (
					<TodoItem key={todo._id} todo={todo} />
				))}
			</Stack>
		</>
	);
};
// Mengekspor komponen TodoList sebagai default export
export default TodoList;
