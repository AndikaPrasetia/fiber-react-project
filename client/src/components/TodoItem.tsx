// Mengimpor komponen-komponen dari Chakra UI
import { Badge, Box, Flex, Spinner, Text } from "@chakra-ui/react";
// Mengimpor ikon centang dari react-icons
import { FaCheckCircle } from "react-icons/fa";
// Mengimpor ikon hapus dari react-icons
import { MdDelete } from "react-icons/md";
// Mengimpor tipe Todo dari file TodoList
import { Todo } from "./TodoList";
// Mengimpor hook useMutation dan useQueryClient dari @tanstack/react-query
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Mengimpor konstanta BASE_URL dari file App
import { BASE_URL } from "../App";

// Mendefinisikan komponen TodoItem yang menerima prop todo
const TodoItem = ({ todo }: { todo: Todo }) => {
	// Mendapatkan instance queryClient
	const queryClient = useQueryClient();

	// Mendefinisikan mutasi untuk mengupdate todo
	const { mutate: updateTodo, isPending: isUpdating } = useMutation({
		mutationKey: ["updateTodo"],
		mutationFn: async () => {
			// Memeriksa apakah todo sudah selesai
			if (todo.completed) return alert("Todo is already completed");
			try {
				// Mengirim permintaan PUT ke server
				const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
					method: "Put",
				});
				// Mengurai respons JSON
				const data = await res.json();
				// Memeriksa apakah respons tidak OK
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		// Menginvalidasi query todos setelah mutasi berhasil
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	// Mendefinisikan mutasi untuk menghapus todo
	const { mutate: deleteTodo, isPending: isDeleting } = useMutation({
		mutationKey: ["deleteTodo"],
		mutationFn: async () => {
			try {
				// Mengirim permintaan DELETE ke server
				const res = await fetch(BASE_URL + `/todos/${todo._id}`, {
					method: "DELETE",
				});
				// Mengurai respons JSON
				const data = await res.json();
				// Memeriksa apakah respons tidak OK
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				console.log(error);
			}
		},
		// Menginvalidasi query todos setelah mutasi berhasil
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	// Mengembalikan JSX untuk render komponen
	return (
		// Flex container utama
		<Flex gap={2} alignItems={"center"}>
			{/*  Flex container untuk konten todo */}
			<Flex
				flex={1}
				alignItems={"center"}
				border={"1px"}
				borderColor={"gray.600"}
				p={2}
				borderRadius={"lg"}
				justifyContent={"space-between"}
			>
				{/*  Teks todo */}
				<Text
					color={todo.completed ? "green.200" : "yellow.100"}
					textDecoration={todo.completed ? "line-through" : "none"}
				>
					{todo.body}
				</Text>
				{/*  Badge untuk todo yang sudah selesai */}
				{todo.completed && (
					<Badge ml='1' colorScheme='green'>
						Done
					</Badge>
				)}
				{/*  Badge untuk todo yang belum selesai */}
				{!todo.completed && (
					<Badge ml='1' colorScheme='yellow'>
						In Progress
					</Badge>
				)}
			</Flex>
			{/*  Flex container untuk tombol aksi */}
			<Flex gap={2} alignItems={"center"}>
				{/*  Tombol untuk menandai todo selesai */}
				<Box color={"green.500"} cursor={"pointer"} onClick={() => updateTodo()}>
					{!isUpdating && <FaCheckCircle size={20} />}
					{isUpdating && <Spinner size={"sm"} />}
				</Box>
				{/*  Tombol untuk menghapus todo */}
				<Box color={"red.500"} cursor={"pointer"} onClick={() => deleteTodo()}>
					{!isDeleting && <MdDelete size={25} />}
					{isDeleting && <Spinner size={"sm"} />}
				</Box>
			</Flex>
		</Flex>
	);
};
// Mengekspor komponen TodoItem
export default TodoItem;
