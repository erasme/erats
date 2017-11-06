
namespace Core
{
	export class DoubleLinkedListNode
	{
		previous: DoubleLinkedListNode;
		next: DoubleLinkedListNode;
		data: any;

		constructor(data: any)
		{
			this.data = data;
		}
	}

	export class DoubleLinkedList
	{
		root: DoubleLinkedListNode = undefined;
		length: 0;

		getLength()
		{
			return this.length;
		}

		getFirstNode()
		{
			return this.root;
		}

		getLastNode()
		{
			if (this.root === undefined)
				return undefined;
			else
				return this.root.previous;
		}

		appendNode(node: DoubleLinkedListNode)
		{
			if (this.root === undefined)
			{
				node.previous = node;
				node.next = node;
				this.root = node;
			}
			else
			{
    		node.previous = this.root.previous;
    		node.next = this.root;
		   	this.root.previous.next = node;
    		this.root.previous = node;
			}
			this.length++;
			return node;
		}

		prependNode(node: DoubleLinkedListNode)
		{
			if (this.root === undefined)
			{
    		node.previous = node;
    		node.next = node;
    		this.root = node;
  		}
			else
			{
    		node.previous = this.root.previous;
    		node.next = this.root;
    		this.root.previous.next = node;
    		this.root.previous = node;
    		this.root = node;
  		}
			this.length++;
			return node;
		}

		removeNode(node: DoubleLinkedListNode)
		{
			if (this.root === node)
			{
				if (node.next === node)
					this.root = undefined;
				else
				{
					node.next.previous = node.previous;
					node.previous.next = node.next;
					this.root = node.next;
				}
			}
			else
			{
				node.next.previous = node.previous;
				node.previous.next = node.next;
			}
			node.next = undefined;
			node.previous = undefined;
			this.length--;
		}

		findNode(data: any)
		{
			if (this.root === undefined)
				return undefined;
			let current = this.root;
			while (current.next !== this.root)
			{
				if (current.data === data)
					return current;
				current = current.next;
			}
			return undefined;
		}

		getFirst()
		{
			let firstNode = this.getFirstNode();
			if (firstNode === undefined)
				return undefined;
			else
				return firstNode.data;
		}

		getLast()
		{
			let lastNode = this.getLastNode();
			if (lastNode === undefined)
				return undefined;
			else
				return lastNode.data;
		}

		append(data: any)
		{
			return this.appendNode(new DoubleLinkedListNode(data));
		}

		prepend(data: any)
		{
			return this.prependNode(new DoubleLinkedListNode(data));
		}

		remove(data)
		{
			let node = this.findNode(data);
			if (node !== undefined)
				this.removeNode(node);
		}

		clear()
		{
			this.root = undefined;
		}

		static moveNext(node: DoubleLinkedListNode)
		{
			if (node !== undefined)
				return node.next;
			else
				return undefined;
		}

		isLast(node: DoubleLinkedListNode)
		{
			if (node === undefined)
				return true;
			else
				return node.next === this.root;
		}
	}
}
