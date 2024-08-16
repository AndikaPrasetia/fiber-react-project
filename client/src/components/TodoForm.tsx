/* eslint-disable @typescript-eslint/no-explicit-any */
// Mengimpor komponen Button, Flex, Input, dan Spinner dari Chakra UI
import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
// Mengimpor hook useMutation dan useQueryClient dari @tanstack/react-query
import { useMutation, useQueryClient } from "@tanstack/react-query";
// Mengimpor hook useState dari React
import { useState } from "react";
// Mengimpor ikon IoMdAdd dari react-icons
import { IoMdAdd } from "react-icons/io";
// Mengimpor konstanta BASE_URL dari file App.tsx
import { BASE_URL } from "../App";

// Mendefinisikan fungsi komponen TodoForm
const TodoForm = () => {
	// Mendefinisikan state newTodo dengan nilai awal string kosong
	const [newTodo, setNewTodo] = useState("");

	// Mendapatkan instance queryClient dari hook useQueryClient
	const queryClient = useQueryClient();

	// Mendefinisikan mutasi createTodo dengan useMutation
	const { mutate: createTodo, isPending: isCreating } = useMutation({
		// Menentukan kunci mutasi
		mutationKey: ["createTodo"],
		// Mendefinisikan fungsi mutasi
		mutationFn: async (e: React.FormEvent) => {
			// Mencegah perilaku default form submit
			e.preventDefault();
			try {
				// Mengirim permintaan POST ke server untuk membuat todo baru
				const res = await fetch(BASE_URL + `/todos`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					// Mengirim body request dalam format JSON
					body: JSON.stringify({ body: newTodo }),
				});
				// Mengurai respons JSON
				const data = await res.json();

				// Memeriksa apakah respons tidak OK
				if (!res.ok) {
					// Melempar error jika respons tidak OK
					throw new Error(data.error || "Something went wrong");
				}

				// Mengosongkan input newTodo
				setNewTodo("");
				// Mengembalikan data respons
				return data;
			} catch (error: any) {
				// Melempar error jika terjadi kesalahan
				throw new Error(error);
			}
		},
		// Menentukan fungsi yang dijalankan saat mutasi berhasil
		onSuccess: () => {
			// Menginvalidasi query todos untuk memperbarui data
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
		// Menentukan fungsi yang dijalankan saat mutasi gagal
		onError: (error: any) => {
			// Menampilkan pesan error dalam alert
			alert(error.message);
		},
	});

	// Mengembalikan elemen form
	return (
		// Menentukan fungsi yang dijalankan saat form disubmit
		<form onSubmit={createTodo}>
			{/* Menggunakan komponen Flex dengan gap 2 */}
			<Flex gap={2}>
				{/* Menggunakan komponen Input dengan tipe text */}
				<Input
					type='text'
					// Mengatur nilai input dengan state newTodo
					value={newTodo}
					// Mengatur state newTodo saat input berubah
					onChange={(e) => setNewTodo(e.target.value)}
					// Mengatur fokus pada input saat dirender
					ref={(input) => input && input.focus()}
				/>
				{/* Menggunakan komponen Button dengan margin horizontal 2 dan tipe submit */}
				<Button
					mx={2}
					type='submit'
					// Mengatur gaya saat tombol aktif
					_active={{
						transform: "scale(.97)",
					}}
				>
					{/* Menampilkan Spinner jika isCreating true, atau ikon IoMdAdd jika false */}
					{isCreating ? <Spinner size={"xs"} /> : <IoMdAdd size={30} />}
				</Button>
			</Flex>
		</form>
	);
};
// Mengekspor komponen TodoForm sebagai default export
export default TodoForm;
